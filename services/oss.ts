import { cachedFunction } from 'nitropack/runtime'
import { createCacheOptions } from '~/utils/cache'
import {
  OsoriOssListResponse,
  OsoriOssVersionResponse,
  OsoriErrorResponse
} from '~/schema/osori'
import { SearchOssQuery, OssDetailQuery } from '~/schema/oss'

const fetchOss = $fetch.create(
  {
    baseURL: 'https://www.olis.or.kr:15443/api/v2/user/oss',
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

export const searchOss = cachedFunction(
  (query: SearchOssQuery): Promise<OsoriOssListResponse | OsoriErrorResponse> => fetchOss<OsoriOssListResponse | OsoriErrorResponse>('', {
    query: {
      equalFlag: query.equalFlag || 'N',
      sort: query.sort || 'name',
      direction: query.direction || 'ASC',
      page: query.page - 1,
      size: query.size,
      ...(query.ossName && { ossName: query.ossName }),
      ...(query.downloadLocation && { downloadLocation: query.downloadLocation }),
      ...(query.version && { version: query.version }),
      // Support query parsing from 'q' parameter
      ...(query?.q?.ossName && { ossName: query.q.ossName }),
      ...(query?.q?.downloadLocation && { downloadLocation: query.q.downloadLocation }),
      ...(query?.q?.version && { version: query.q.version }),
    },
  }),
  createCacheOptions('oss', (e) => {
    const ossMasters = (e.value as OsoriOssListResponse)?.messageList?.oss_master
    return !(!e.value || e.value.code !== '200' || !ossMasters)
  }),
)

export const fetchOssVersions = cachedFunction(
  async (query: OssDetailQuery): Promise<OsoriOssVersionResponse | OsoriErrorResponse> => {
    return await fetchOss<OsoriOssVersionResponse | OsoriErrorResponse>(`/${encodeURIComponent(query.category)}/versions`, {
      query: {
        searchWord: query.searchWord
      }
    })
  },
  createCacheOptions('oss-versions', (e) => {
    return !(!e.value || e.value.code !== '200')
  }),
)