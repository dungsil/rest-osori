import * as v from 'valibot'
import { pageSpec } from './pagination'
import { parseSearchQuery } from '~/utils/search'
import { createError, EventHandlerRequest, getRouterParam, getValidatedQuery, H3Event } from 'h3'

/**
 * OSS 검색 쿼리 인터페이스 (OpenAPI 스펙 기반)
 */
export interface OssQuery {
  /** OSS 이름 */
  ossName?: string
  /** 다운로드 위치 */
  downloadLocation?: string
  /** 버전 */
  version?: string
}

/**
 * OSS 상세 조회 쿼리 인터페이스
 */
export interface OssDetailQuery {
  /** OSS 카테고리 (id, name, download_location) */
  category: string
  /** 검색어 */
  searchWord: string
}

const searchOssSpec = v.object({
  ...pageSpec.entries,
  equalFlag: v.optional(v.picklist(['Y', 'N'])),
  sort: v.optional(v.picklist(['name', 'nickname', 'version'])),
  direction: v.optional(v.picklist(['ASC', 'DESC'])),
  ossName: v.optional(v.string()),
  downloadLocation: v.optional(v.string()),
  version: v.optional(v.string()),
  q: v.optional(
    v.pipe(
      v.string(),
      v.transform((v) => parseSearchQuery<OssQuery>(v, (q) => {
        let key: string
        switch (q.field) {
          case 'name':
            key = 'ossName'
            break
          case 'download':
          case 'downloadLocation':
            key = 'downloadLocation'
            break
          case 'version':
            key = 'version'
            break
          default:
            key = 'ossName'
        }

        return { [key]: q.value.value }
      }))
    )
  )
})

export type SearchOssQuery = v.InferOutput<typeof searchOssSpec>

export async function getSearchOssQuery (e: H3Event<EventHandlerRequest>): Promise<SearchOssQuery> {
  return getValidatedQuery<SearchOssQuery>(e, (value) => v.parse(searchOssSpec, value))
}

const ossDetailSpec = v.object({
  category: v.string(),
  searchWord: v.string()
})

export type OssDetailQuerySpec = v.InferOutput<typeof ossDetailSpec>

export async function getOssDetailQuery (e: H3Event<EventHandlerRequest>): Promise<OssDetailQuery> {
  const category = getRouterParam(e, 'category')
  const query = await getValidatedQuery(e, (value) => ({ searchWord: value.searchWord }))

  if (!category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'OSS category is required'
    })
  }

  if (!query.searchWord) {
    throw createError({
      statusCode: 400,
      statusMessage: 'searchWord parameter is required'
    })
  }

  return { category, searchWord: query.searchWord }
}