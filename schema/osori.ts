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

/**
 * OSORI API OSS 버전 정보 인터페이스
 * 
 * @description 업스트림 OSORI API에서 반환되는 OSS 버전 정보 구조
 */
export interface OsoriOssVersion {
  /** OSS 버전 ID */
  oss_version_id: number,
  /** 버전 */
  version: string | null,
  /** 선언된 라이선스 목록 */
  declaredLicenseList: string | null,
  /** 탐지된 라이선스 목록 */
  detectedLicenseList: string | null,
  /** 제한사항 목록 */
  restrictionList: string | null
}

/**
 * OSORI API OSS 마스터 정보 인터페이스 (목록 조회용)
 * 
 * @description 업스트림 OSORI API에서 반환되는 OSS 마스터 정보 구조
 */
export interface OsoriOssMaster {
  /** OSS 이름 */
  name: string,
  /** OSS 마스터 ID */
  oss_master_id: number,
  /** 버전 라이선스 차이 여부 */
  version_license_diff: boolean,
  /** Package URL */
  purl: string,
  /** 버전 목록 */
  version: OsoriOssVersion[]
}

/**
 * OSORI API OSS 목록 응답 인터페이스
 * 
 * @description 업스트림 OSORI API에서 반환되는 OSS 목록 응답 구조
 */
export interface OsoriOssListResponse extends OsoriResponse<{
  /** OSS 마스터 목록 */
  oss_master: OsoriOssMaster[]
}> {}

/**
 * OSORI API OSS 버전 상세 정보 인터페이스
 * 
 * @description 업스트림 OSORI API에서 반환되는 OSS 버전 상세 정보 구조
 */
export interface OsoriOssVersionDetail {
  /** OSS 버전 ID */
  oss_version_id: number,
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
  created_date: string,
  /** 수정일 */
  modified_date: string,
  /** 저작권 */
  copyright: string | null,
  /** 선언된 라이선스 목록 */
  declaredLicenseList: string[] | null,
  /** 탐지된 라이선스 목록 */
  detectedLicenseList: string[] | null,
  /** 제한사항 목록 */
  restrictionList: string[] | null
}

/**
 * OSORI API OSS 버전 상세 응답 인터페이스
 * 
 * @description 업스트림 OSORI API에서 반환되는 OSS 버전 상세 응답 구조
 */
export interface OsoriOssVersionResponse extends OsoriResponse<{
  /** 상세 정보 */
  detailInfo: {
    /** OSS 버전 목록 */
    oss_version: OsoriOssVersionDetail[]
  }[]
}> {}
