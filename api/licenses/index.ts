import { defineCachedEventHandler, defineRouteMeta } from 'nitropack/runtime'
import { getSearchLicenseQuery, LicenseInfo } from '~/schema/license'
import { searchLicenseWithDetails } from '~/services/license'
import { OsoriErrorResponse, OsoriLicenseInfo, OsoriListResponse } from '~/schema/osori'
import { createErrorResponse } from '~/utils/error'
import { Page } from '~/schema/pagination'

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
        spdx_identifier: i.spdx_identifier || '',
        osi_approval: i.osi_approval,
        license_text: i.license_text || '',
        webpage: i.webpage || '',
        obligation_disclosing_src: i.obligation_disclosing_src,
        obligation_notification: i.obligation_notification ? 'Y' : 'N',
        obligation_including_license: 'N/A',
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
