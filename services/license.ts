import { version } from '../package.json'
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
import { transformLicenseDetail } from '~/utils/license-transform'

const fetchLicense = $fetch.create(
  {
    baseURL: 'https://www.olis.or.kr:15443/api/v2/user/licenses',
    method: 'GET',
    headers: {
      'User-Agent': `rest-osori/${version}`,
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

export const searchLicense = cachedFunction<OsoriListResponse<OsoriLicenseInfo> | OsoriErrorResponse>(
  (query: SearchLicenseQuery): Promise<OsoriListResponse<OsoriLicenseInfo>> => fetchLicense<OsoriListResponse<OsoriLicenseInfo>>('', {
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

export const getLicenseDetail = cachedFunction<OsoriDetailResponse<OsoriLicenseDetailInfo> | OsoriErrorResponse>(
  (query: LicenseDetailQuery): Promise<OsoriDetailResponse<OsoriLicenseDetailInfo>> => fetchLicense<OsoriDetailResponse<OsoriLicenseDetailInfo>>(`/id?searchWord=${query.id}`),
  createCacheOptions('license-id', (e) => {
    return !(!e.value || !e.value.success)
  }),
)

export const searchLicenseWithDetails = cachedFunction<OsoriListResponse<OsoriLicenseInfo> | OsoriErrorResponse>(
  async (query: SearchLicenseQuery): Promise<OsoriListResponse<OsoriLicenseInfo>> => {
    const searchResult = await searchLicense(query)
    
    if (!searchResult.success) {
      return searchResult
    }

    const detailedLicenses = await Promise.all(
      searchResult.messageList.list.map(async (license) => {
        const detailResult = await getLicenseDetail({ id: license.id.toString() })
        
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
        
        return license
      })
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
