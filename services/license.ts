import { cachedFunction } from 'nitropack/runtime'
import { createCacheOptions } from '~/utils/cache'
import {
  OsoriDetailResponse,
  OsoriErrorResponse,
  OsoriLicenseDetailInfo,
  OsoriLicenseInfo,
  OsoriListResponse
} from '~/schema/osori'
import { LicenseDetailQuery, SearchLicenseQuery } from '~/schema/license'
import { processBatch, transformLicenseDetail } from '~/utils/license-transform'

const fetchLicense = $fetch.create(
  {
    baseURL: 'https://www.olis.or.kr:15443/api/v2/user/licenses',
    method: 'GET',
    headers: {
      'User-Agent': `rest-osori/1.0.0`,
    },

    retry: 3,
    retryDelay: 500,
    retryStatusCodes: [425, 429, 500, 502, 503, 504],
    ignoreResponseError: true,

    onRequest ({ request, options }) {
      console.log(`${options.method} ${options.baseURL}${request}?${new URLSearchParams(options.query).toString()}`)
    }
  }
)

export const searchLicense = cachedFunction(
  (query: SearchLicenseQuery): Promise<OsoriListResponse<OsoriLicenseInfo> | OsoriErrorResponse> => fetchLicense<OsoriListResponse<OsoriLicenseInfo> | OsoriErrorResponse>('', {
    query: {
      equalFlag: 'N',
      sort: 'id',
      direction: 'ASC',

      id: query?.q?.id ?? '',
      name: query?.q?.name ?? '',
      spdxIdentifier: query?.q?.spdx ?? '',

      page: query.page - 1,
      size: query.size,
    },
  }),
  createCacheOptions('licenses', (e) => {
    const count = (e.value as OsoriListResponse<OsoriLicenseInfo>)?.messageList?.count

    return !(!e.value || count === undefined || count === 0)
  }),
)

export const fetchLicenseByIdOrSpdxId = cachedFunction(
  async (query: LicenseDetailQuery): Promise<OsoriDetailResponse<OsoriLicenseDetailInfo> | OsoriErrorResponse> => {
    // 숫자인지 확인하여 ID 직접 조회 또는 SPDX 검색 결정
    if (!isNaN(Number(query.id))) {
      // 숫자면 ID로 직접 조회
      return await fetchLicense<OsoriDetailResponse<OsoriLicenseDetailInfo> | OsoriErrorResponse>(`/id?searchWord=${query.id}`)
    } else {
      return await fetchLicense<OsoriDetailResponse<OsoriLicenseDetailInfo> | OsoriErrorResponse>(`/spdx_identifier?searchWord=${query.id}`)
    }
  },
  createCacheOptions('license-id', (e) => {
    return !(!e.value || !e.value.success)
  }),
)

export const searchLicenseWithDetails = cachedFunction(
  async (query: SearchLicenseQuery): Promise<OsoriListResponse<OsoriLicenseInfo> | OsoriErrorResponse> => {
    const searchResult = await searchLicense(query)

    if (!searchResult.success) {
      return searchResult
    }

    // 배치 처리로 동시 요청 수 제한 (기본값: 5개씩 처리)
    const detailedLicenses = await processBatch(
      searchResult.messageList.list,
      async (license: OsoriLicenseInfo) => {
        try {
          const detailResult = await fetchLicenseByIdOrSpdxId({ id: license.id.toString() })

          if (detailResult.success && detailResult.messageList.detailInfo[0]) {
            const detail = detailResult.messageList.detailInfo[0]
            // 업스트림 데이터 변환 적용 (nicknamelist 문자열 -> 배열)
            const transformedDetail = transformLicenseDetail(detail)

            return {
              ...license,
              spdx_identifier: transformedDetail.spdx_identifier,
              license_text: transformedDetail.license_text,
              webpage: transformedDetail.webpage,
              created_date: transformedDetail.created_date,
              modified_date: transformedDetail.modified_date,
              nicknamelist: transformedDetail.nicknamelist,
              webpagelist: transformedDetail.webpagelist,
              restrictionlist: transformedDetail.restrictionlist,
              description: transformedDetail.description,
              description_ko: transformedDetail.description_ko
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch details for license ${license.id}:`, error)
        }

        return license
      },
      10 // 동시에 최대 10개의 요청만 처리
    )

    return {
      ...searchResult,
      messageList: {
        ...searchResult.messageList,
        list: detailedLicenses
      }
    }
  },
  createCacheOptions('licenses-with-details', (e) => {
    const count = (e.value as OsoriListResponse<OsoriLicenseInfo>)?.messageList?.count
    return !(!e.value || count === undefined || count === 0)
  }),
)
