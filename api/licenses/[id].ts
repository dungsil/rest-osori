import { defineCachedEventHandler, defineRouteMeta } from 'nitropack/runtime'
import { createError } from 'h3'
import { getLicenseDetailQuery, LicenseInfo } from '~/schema/license'
import { getLicenseDetail } from '~/services/license'
import { OsoriErrorResponse, OsoriLicenseDetailInfo, OsoriDetailResponse } from '~/schema/osori'
import { createErrorResponse } from '~/utils/error'

export default defineCachedEventHandler(async (e) => {
  const query = await getLicenseDetailQuery(e)

  const response = await getLicenseDetail(query)

  if (response.success) {
    const detail = response as OsoriDetailResponse<OsoriLicenseDetailInfo>
    const licenseInfo = detail.messageList.detailInfo[0]

    if (!licenseInfo) {
      throw createError({
        statusCode: 404,
        statusMessage: 'License not found'
      })
    }

    return <LicenseInfo>{
      id: licenseInfo.id,
      name: licenseInfo.name,
      spdx_identifier: licenseInfo.spdx_identifier,
      osi_approval: licenseInfo.osi_approval,
      license_text: licenseInfo.license_text,
      webpage: licenseInfo.webpage,
      obligation_disclosing_src: licenseInfo.obligation_disclosing_src,
      obligation_notification: licenseInfo.obligation_notification ? 'Y' : 'N',
      obligation_including_license: licenseInfo.obligation_including_license || 'N/A',
      created_at: licenseInfo.created_date,
      modified_at: licenseInfo.modified_date,
      nicknames: licenseInfo.nicknamelist || []
    }
  }

  return createErrorResponse(e, response as OsoriErrorResponse)
})

defineRouteMeta({
  openAPI: {
    tags: ['licenses'],
    description: '라이선스 상세 조회 API',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: '라이선스 ID'
      }
    ]
  }
})