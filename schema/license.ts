import * as v from 'valibot'
import { pageSpec } from './pagination'
import { parseSearchQuery } from '~/utils/search'
import { createError, EventHandlerRequest, getRouterParam, getValidatedQuery, H3Event } from 'h3'

/**
 * 라이선스 검색 쿼리 인터페이스
 */
export interface LicenseQuery {
  /** 라이선스 ID */
  id?: string
  /** SPDX 식별자 */
  spdx?: string
  /** 라이선스 이름 */
  name?: string
}

/**
 * 소스코드 공개 의무 타입
 *
 * @description 라이선스에 따른 소스코드 공개 범위를 나타냅니다.
 */
export type ObligationDisclosingSrc =
/** 공개 의무 없음 */
  | 'NONE'
  /** 원본 소스코드 공개 */
  | 'ORIGINAL'
  /** 파일 단위 공개 */
  | 'FILE'
  /** 모듈 단위 공개 */
  | 'MODULE'
  /** 라이브러리 단위 공개 */
  | 'LIBRARY'
  /** 파생 저작물 공개 */
  | 'DERIVATIVE WORK'
  /** 실행 파일 공개 */
  | 'EXECUTABLE'
  /** 데이터 공개 */
  | 'DATA'
  /** 이를 사용하는 소프트웨어 공개 */
  | 'SOFTWARE USING THIS'
  /** 명시되지 않음 */
  | 'UNSPECIFIED'

/**
 * 라이선스 포함 의무 타입
 *
 * @description 배포 시 라이선스 텍스트 포함 요구사항을 나타냅니다.
 */
export type ObligationIncludingLicense =
/** 라이선스 포함 필수 */
  | 'REQUIRED'
  /** 라이선스 포함 선택사항 */
  | 'OPTIONAL'
  /** 라이선스 포함 권장 */
  | 'RECOMMENDED'
  /** 라이선스 포함 불필요 */
  | 'NONE'
  /** 명시되지 않음 */
  | 'UNSPECIFIED'

/**
 * 라이선스 정보 인터페이스
 *
 * @description API에서 반환되는 라이선스 정보의 구조를 정의합니다.
 */
export interface LicenseInfo {
  /** 라이선스 고유 ID */
  id: number,
  /** 라이선스 이름 */
  name: string,
  /** SPDX 식별자 */
  spdx: string,
  /** OSI 승인 여부 */
  osi_approval: boolean,
  /** 라이선스 전문 */
  license_text: string,
  /** 라이선스 웹페이지 URL */
  url: string,
  /** 라이선스 의무사항 */
  obligations: {
    /** 소스코드 공개 의무 */
    disclosing_src: ObligationDisclosingSrc,
    /** 고지 의무 */
    notification: boolean,
    /** 라이선스 포함 의무 */
    including_license: ObligationIncludingLicense
  },
  /** 생성 일시 */
  created_at: string,
  /** 수정 일시 */
  modified_at: string,
  /** 라이선스 별칭 목록 */
  nicknames: string[]
}

/**
 * 라이선스 상세 조회 쿼리 인터페이스
 */
export interface LicenseDetailQuery {
  /** 라이선스 ID */
  id: string
}

const searchLicenseSpec = v.object({
  ...pageSpec.entries,
  q: v.optional(
    v.pipe(
      v.string(),
      v.transform((v) => parseSearchQuery<LicenseQuery>(v, (q) => {
        let key: string
        switch (q.field) {
          case 'id':
            key = 'id'
            break
          case 'spdx':
            key = 'spdx'
            break
          case 'name':
          default:
            key = 'name'
        }

        return { [key]: q.value.value }
      }))
    )
  )
})

export type SearchLicenseQuery = v.InferOutput<typeof searchLicenseSpec>

export async function getSearchLicenseQuery (e: H3Event<EventHandlerRequest>): Promise<SearchLicenseQuery> {
  return getValidatedQuery<SearchLicenseQuery>(e, (value) => v.parse(searchLicenseSpec, value))
}

const licenseDetailSpec = v.object({
  id: v.string()
})

export type LicenseDetailQuerySpec = v.InferOutput<typeof licenseDetailSpec>

export async function getLicenseDetailQuery (e: H3Event<EventHandlerRequest>): Promise<LicenseDetailQuery> {
  const id = getRouterParam(e, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'License ID is required'
    })
  }

  return { id }
}
