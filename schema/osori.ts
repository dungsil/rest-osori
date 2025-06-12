export interface OsoriResponse<T = unknown> {
  code: '200' | '400' | '429'
  success: boolean
  messageList: T
}

export interface OsoriListResponse<T = unknown> extends OsoriResponse<{
  page: number,
  size: number,
  count: number,
  list: T[]
}> {
  success: true
}

export interface OsoriDetailResponse<T = unknown> extends OsoriResponse<{
  detailInfo: T[]
}> {
  success: true
}

export interface OsoriErrorResponse extends OsoriResponse<{
  errors: {
    message: string
    detailInfo?: object
  }[]
}> {
  success: false
}

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
