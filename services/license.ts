import { version } from '../package.json'
import { cachedFunction } from 'nitropack/runtime'
import { createCacheOptions } from '~/utils/cache'
import { OsoriErrorResponse, OsoriLicenseInfo, OsoriListResponse } from '~/schema/osori'
import { SearchLicenseQuery } from '~/schema/license'

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

      id: query.q.id ?? '',
      name: query.q.name ?? '',
      spdxIdentifier: query.q.spdx ?? '',
      page: query.page - 1,
      size: query.size,
    },
  }),
  createCacheOptions('licenses', (e) => {
    const count = (e.value as OsoriListResponse<OsoriLicenseInfo>)?.messageList?.count

    return !(!e.value || count === undefined || count === 0)
  }),
)
