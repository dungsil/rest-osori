import { defineCachedEventHandler, defineRouteMeta } from 'nitropack/runtime'
import { getSearchLicenseQuery, LicenseInfo } from '~/schema/license'
import { searchLicense } from '~/services/license'
import { OsoriErrorResponse, OsoriLicenseInfo, OsoriListResponse } from '~/schema/osori'
import { createErrorResponse } from '~/utils/error'
import { Page } from '~/schema/pagination'

export default defineCachedEventHandler(async (e) => {
  const query = await getSearchLicenseQuery(e)

  const response = await searchLicense(query)

  if (response.success) {
    const list = response as OsoriListResponse<OsoriLicenseInfo>

    return <Page<LicenseInfo>>{
      total_count: list.messageList.count,
      items: list.messageList.list.map((i) => ({
        id: i.id,
        name: i.name,
        osi_approval: i.osi_approval,
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
