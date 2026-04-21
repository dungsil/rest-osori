import * as v from 'valibot'
import { pageSpec } from './pagination'
import { parseSearchQuery } from '~/utils/search'
import { EventHandlerRequest, getValidatedQuery, H3Event } from 'h3'

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
 * OSS 정보 인터페이스
 *
 * @description API에서 반환되는 OSS 정보의 구조를 정의합니다.
 */
export interface OssInfo {
  /** OSS 고유 ID */
  id: number,
  /** OSS 이름 */
  name: string,
  /** 버전 라이선스 차이 여부 */
  version_license_diff: boolean,
  /** Package URL */
  purl: string,
  /** 버전 목록 */
  versions: OssVersionInfo[]
}

/**
 * OSS 버전 정보 인터페이스
 *
 * @description API에서 반환되는 OSS 버전 정보의 구조를 정의합니다.
 */
export interface OssVersionInfo {
  /** OSS 버전 ID */
  id: number,
  /** 버전 */
  version: string | null,
  /** 선언된 라이선스 목록 */
  declared_licenses: string | null,
  /** 탐지된 라이선스 목록 */
  detected_licenses: string | null,
  /** 제한사항 목록 */
  restrictions: string | null
}

/**
 * OSS 버전 상세 정보 인터페이스
 *
 * @description API에서 반환되는 OSS 버전 상세 정보의 구조를 정의합니다.
 */
export interface OssVersionDetail {
  /** OSS 버전 ID */
  id: number,
  /** 버전 */
  version: string | null,
  /** 설명 */
  description: string | null,
  /** 한국어 설명 */
  description_ko: string | null,
  /** 저작권 표시 */
  attribution: string | null,
  /** 라이선스 조합 */
  license_combination: string,
  /** 릴리스 날짜 */
  release_date: string | null,
  /** 생성일 */
  created_at: string,
  /** 수정일 */
  modified_at: string,
  /** 저작권 */
  copyright: string | null,
  /** 선언된 라이선스 목록 */
  declared_licenses: string[] | null,
  /** 탐지된 라이선스 목록 */
  detected_licenses: string[] | null,
  /** 제한사항 목록 */
  restrictions: string[] | null
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