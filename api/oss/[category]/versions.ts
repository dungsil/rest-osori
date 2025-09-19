import { defineCachedEventHandler, defineRouteMeta } from 'nitropack/runtime'
import { getOssDetailQuery } from '~/schema/oss'
import { fetchOssVersions } from '~/services/oss'
import { OsoriErrorResponse } from '~/schema/osori'
import { createErrorResponse } from '~/utils/error'

export default defineCachedEventHandler(async (e) => {
  const query = await getOssDetailQuery(e)

  const response = await fetchOssVersions(query)

  if (response.code === '200') {
    // 원본 API와 동일하게 출력 (프록시 및 캐싱기능만 적용)
    return response
  }

  return createErrorResponse(e, response as OsoriErrorResponse)
})

defineRouteMeta({
  openAPI: {
    tags: ['oss'],
    summary: 'OSS 상세 조회(사용자)',
    description: 'OSS 상세 조회(사용자)',
    parameters: [
      {
        name: 'category',
        in: 'path',
        required: true,
        schema: { 
          type: 'string', 
          enum: ['id', 'name', 'download_location'],
          default: 'name'
        },
        description: '검색 카테고리'
      },
      {
        name: 'searchWord',
        in: 'query',
        required: true,
        schema: { type: 'string' },
        description: '검색어'
      }
    ]
  }
})