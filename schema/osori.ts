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
  obligation_disclosing_src: 'NONE'
}
