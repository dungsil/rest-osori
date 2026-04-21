import { defineCachedEventHandler, defineRouteMeta } from 'nitropack/runtime'
import { createError, getRouterParam } from 'h3'
import { fetchOssVersions } from '~/services/oss'
import { OsoriOssVersionResponse, OsoriErrorResponse } from '~/schema/osori'
import { createErrorResponse } from '~/utils/error'
import { transformOssVersionDetail } from '~/utils/oss-transform'

export default defineCachedEventHandler(async (e) => {
  const id = getRouterParam(e, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'OSS ID is required'
    })
  }

  // Try searching by different categories (id, name, download_location)
  const searchStrategies = [
    { category: 'id', searchWord: id },
    { category: 'name', searchWord: id },
    { category: 'download_location', searchWord: id }
  ]

  for (const strategy of searchStrategies) {
    const response = await fetchOssVersions(strategy)

    if (response.code === '200') {
      const detail = response as OsoriOssVersionResponse
      const versionInfo = detail.messageList.detailInfo[0]?.oss_version[0]

      if (versionInfo) {
        return transformOssVersionDetail(versionInfo)
      }
    } else if (response.code === '429') {
      // Rate limit - propagate immediately instead of trying next strategy
      return createErrorResponse(e, response as OsoriErrorResponse)
    }
  }

  throw createError({
    statusCode: 404,
    statusMessage: 'OSS not found'
  })
})

defineRouteMeta({
  openAPI: {
    tags: ['oss'],
    summary: 'OSS 상세 조회',
    description: 'OSS 상세 정보 조회',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: 'OSS ID, 이름 또는 다운로드 위치. 다운로드 위치에 슬래시(/)가 포함되면 반드시 URL 인코딩된 값을 사용해야 합니다 (예: 1, spring-boot, github.com%2Fspring-projects%2Fspring-boot)'
      }
    ]
  }
})