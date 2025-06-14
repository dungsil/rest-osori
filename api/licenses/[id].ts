import { defineCachedEventHandler, defineRouteMeta } from 'nitropack/runtime'
import { createError } from 'h3'
import { getLicenseDetailQuery, LicenseInfo } from '~/schema/license'
import { fetchLicenseByIdOrSpdxId } from '~/services/license'
import { OsoriDetailResponse, OsoriErrorResponse, OsoriLicenseDetailInfo } from '~/schema/osori'
import { createErrorResponse } from '~/utils/error'
import { transformLicenseDetail } from '~/utils/license-transform'

export default defineCachedEventHandler(async (e) => {
  const query = await getLicenseDetailQuery(e)

  const response = await fetchLicenseByIdOrSpdxId(query)

  if (response.success) {
    const detail = response as OsoriDetailResponse<OsoriLicenseDetailInfo>
    const licenseInfo = detail.messageList.detailInfo[0]

    if (!licenseInfo) {
      throw createError({
        statusCode: 404,
        statusMessage: 'License not found'
      })
    }

    // 업스트림 데이터 변환 적용 (nicknamelist 문자열 -> 배열)
    const transformedLicense = transformLicenseDetail(licenseInfo)

    return <LicenseInfo>{
      id: transformedLicense.id,
      name: transformedLicense.name,
      spdx: transformedLicense.spdx_identifier,
      osi_approval: transformedLicense.osi_approval,
      license_text: transformedLicense.license_text,
      url: transformedLicense.webpage,
      obligations: transformedLicense.obligations,
      nicknames: transformedLicense.nicknamelist
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
        description: '라이선스 ID 또는 SPDX ID (예: 1 또는 MIT)'
      }
    ]
  }
})
