/**
 * OSORI API 기본 응답 인터페이스
 * 
 * @template T - 응답 데이터 타입
 */
export interface OsoriResponse<T = unknown> {
  /** 응답 코드 */
  code: '200' | '400' | '429'
  /** 성공 여부 */
  success: boolean
  /** 응답 메시지 데이터 */
  messageList: T
}

/**
 * OSORI API 목록 응답 인터페이스
 * 
 * @template T - 목록 아이템 타입
 */
export interface OsoriListResponse<T = unknown> extends OsoriResponse<{
  /** 현재 페이지 번호 */
  page: number,
  /** 페이지 크기 */
  size: number,
  /** 전체 아이템 수 */
  count: number,
  /** 아이템 목록 */
  list: T[]
}> {
  success: true
}

/**
 * OSORI API 상세 응답 인터페이스
 * 
 * @template T - 상세 정보 타입
 */
export interface OsoriDetailResponse<T = unknown> extends OsoriResponse<{
  /** 상세 정보 배열 */
  detailInfo: T[]
}> {
  success: true
}

/**
 * OSORI API 오류 응답 인터페이스
 */
export interface OsoriErrorResponse extends OsoriResponse<{
  /** 오류 목록 */
  errors: {
    /** 오류 메시지 */
    message: string
    /** 상세 오류 정보 */
    detailInfo?: object
  }[]
}> {
  success: false
}

/**
 * OSORI API 라이선스 정보 인터페이스 (목록 조회용)
 * 
 * @description 업스트림 OSORI API에서 반환되는 라이선스 목록 아이템 구조
 */
export interface OsoriLicenseInfo {
  /** 라이선스 ID */
  id: number,

  /** 라이선스 명 */
  name: string,

  /** OSI 승인 여부 */
  osi_approval: boolean,

  /** 소스코드 공개 여부 */
  obligation_disclosing_src: string,

  /** 고지 의무 */
  obligation_notification: boolean,

  /** SPDX 식별자 */
  spdx_identifier?: string,

  /** 라이선스 전문 */
  license_text?: string,

  /** 웹페이지 */
  webpage?: string,

  /** 생성일 */
  created_date?: string,

  /** 수정일 */
  modified_date?: string,

  /** 별칭 목록 */
  nicknamelist?: string[] | null,

  /** 웹페이지 목록 */
  webpagelist?: string[] | null,

  /** 제한사항 목록 */
  restrictionlist?: string[] | null,

  /** 설명 */
  description?: string | null,

  /** 한국어 설명 */
  description_ko?: string | null
}

/**
 * OSORI API 라이선스 상세 정보 인터페이스
 * 
 * @description 업스트림 OSORI API에서 반환되는 라이선스 상세 정보 구조
 */
export interface OsoriLicenseDetailInfo {
  /** 라이선스 ID */
  id: number,

  /** 라이선스 명 */
  name: string,

  /** SPDX 식별자 */
  spdx_identifier: string,

  /** OSI 승인 여부 */
  osi_approval: boolean,

  /** 라이선스 전문 */
  license_text: string,

  /** 웹페이지 */
  webpage: string,

  /** 소스코드 공개 의무 */
  obligation_disclosing_src: string,

  /** 고지 의무 */
  obligation_notification: boolean,

  /** 라이선스 포함 의무 */
  obligation_including_license: string,

  /** 생성일 */
  created_date: string,

  /** 수정일 */
  modified_date: string,

  /** 별칭 목록 */
  nicknamelist: string[] | null,

  /** 웹페이지 목록 */
  webpagelist: string[] | null,

  /** 제한사항 목록 */
  restrictionlist: string[] | null,

  /** 설명 */
  description: string | null,

  /** 한국어 설명 */
  description_ko: string | null
}
