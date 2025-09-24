import { defineCachedEventHandler, defineRouteMeta } from 'nitropack/runtime'
import { getSearchOssQuery, OssInfo } from '~/schema/oss'
import { searchOss } from '~/services/oss'
import { OsoriErrorResponse, OsoriOssListResponse } from '~/schema/osori'
import { createErrorResponse } from '~/utils/error'
import { Page } from '~/schema/pagination'
import { transformOssMaster } from '~/utils/oss-transform'

export default defineCachedEventHandler(async (e) => {
  const query = await getSearchOssQuery(e)

  const response = await searchOss(query)

  if (response.code === '200') {
    const list = response as OsoriOssListResponse

    return <Page<OssInfo>>{
      total_count: list.messageList.oss_master?.length || 0,
      items: list.messageList.oss_master?.map(transformOssMaster) || []
    }
  }

  return createErrorResponse(e, response as OsoriErrorResponse)
})

defineRouteMeta({
  openAPI: {
    tags: ['oss'],
    summary: 'OSS 조회',
    description: 'OSS 목록 조회',
    parameters: [
      {
        name: 'ossName',
        in: 'query',
        required: false,
        schema: { type: 'string' },
        description: 'OSS 이름'
      },
      {
        name: 'downloadLocation',
        in: 'query',
        required: false,
        schema: { type: 'string' },
        description: '다운로드 위치'
      },
      {
        name: 'version',
        in: 'query',
        required: false,
        schema: { type: 'string' },
        description: '버전'
      },
      {
        name: 'equalFlag',
        in: 'query',
        required: false,
        schema: { type: 'string', enum: ['Y', 'N'], default: 'N' },
        description: '정확 일치 여부'
      },
      {
        name: 'page',
        in: 'query',
        required: false,
        schema: { type: 'integer', default: 1 },
        description: '페이지 번호 (1부터 시작)'
      },
      {
        name: 'size',
        in: 'query',
        required: false,
        schema: { type: 'integer', default: 20 },
        description: '페이지 크기'
      },
      {
        name: 'sort',
        in: 'query',
        required: false,
        schema: { type: 'string', enum: ['name', 'nickname', 'version'], default: 'name' },
        description: '정렬 기준'
      },
      {
        name: 'direction',
        in: 'query',
        required: false,
        schema: { type: 'string', enum: ['ASC', 'DESC'], default: 'ASC' },
        description: '정렬 방향'
      },
      {
        name: 'q',
        in: 'query',
        required: false,
        schema: { type: 'string' },
        description: 'Lucene 스타일 검색 쿼리 (예: name:spring, download:github.com)'
      }
    ]
  }
})