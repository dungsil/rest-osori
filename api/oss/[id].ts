import { defineCachedEventHandler, defineRouteMeta } from 'nitropack/runtime'
import { createError } from 'h3'
import { OssVersionDetail } from '~/schema/oss'
import { fetchOssVersions } from '~/services/oss'
import { OsoriOssVersionResponse, OsoriErrorResponse } from '~/schema/osori'
import { createErrorResponse } from '~/utils/error'
import { transformOssVersionDetail } from '~/utils/oss-transform'
import { EventHandlerRequest, getRouterParam, H3Event } from 'h3'

export default defineCachedEventHandler(async (e: H3Event<EventHandlerRequest>) => {
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
        description: 'OSS ID, 이름 또는 다운로드 위치 (예: 1, spring-boot, github.com/spring-projects/spring-boot)'
      }
    ]
  }
})