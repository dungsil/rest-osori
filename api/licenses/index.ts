import { defineCachedEventHandler, defineRouteMeta } from 'nitropack/runtime'
import { getSearchLicenseQuery, LicenseInfo } from '~/schema/license'
import { searchLicenseWithDetails } from '~/services/license'
import { OsoriErrorResponse, OsoriLicenseInfo, OsoriListResponse } from '~/schema/osori'
import { createErrorResponse } from '~/utils/error'
import { Page } from '~/schema/pagination'
import { transformObligations } from '~/utils/license-transform'

export default defineCachedEventHandler(async (e) => {
  const query = await getSearchLicenseQuery(e)

  const response = await searchLicenseWithDetails(query)

  if (response.success) {
    const list = response as OsoriListResponse<OsoriLicenseInfo>

    return <Page<LicenseInfo>>{
      total_count: list.messageList.count,
      items: list.messageList.list.map((i) => ({
        id: i.id,
        name: i.name,
        spdx: i.spdx_identifier || '',
        osi_approval: i.osi_approval,
        license_text: i.license_text || '',
        webpage: i.webpage || '',
        obligations: transformObligations(i),
        nicknames: i.nicknamelist || []
      }))
    }
  }

  return createErrorResponse(e, response as OsoriErrorResponse)
})

defineRouteMeta({
  openAPI: {
    tags: ['licenses'],
    description: '라이선스 조회 API',
  }
})
