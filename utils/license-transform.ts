/**
 * 라이선스 데이터 변환 유틸리티
 * 
 * 이 파일은 업스트림 OSORI API의 데이터 형식 불일치를 해결하기 위한 임시 변환 로직을 포함합니다.
 * 업스트림에서 수정되면 해당 함수들을 제거할 수 있습니다.
 */

import type { ObligationDisclosingSrc, ObligationIncludingLicense } from '~/schema/license'

/**
 * 업스트림 API에서 nicknamelist가 문자열로 반환되는 것을 배열로 변환
 * 
 * TODO: 업스트림 API에서 nicknamelist를 올바른 배열 형식으로 반환하면 이 함수를 제거하세요.
 * 
 * @param nicknamelist - 업스트림에서 받은 nicknamelist (문자열 또는 배열)
 * @returns 파싱된 문자열 배열
 */
export function parseNicknameList(nicknamelist: string | string[] | null | undefined): string[] {
  if (!nicknamelist) {
    return []
  }
  
  // 이미 배열인 경우 (업스트림 수정 후)
  if (Array.isArray(nicknamelist)) {
    return nicknamelist
  }
  
  // 문자열인 경우 JSON 파싱 시도
  if (typeof nicknamelist === 'string') {
    try {
      // JSON 배열 형식인지 확인 (예: ["nickname1", "nickname2"])
      if (nicknamelist.trim().startsWith('[') && nicknamelist.trim().endsWith(']')) {
        const parsed = JSON.parse(nicknamelist)
        return Array.isArray(parsed) ? parsed : []
      }
      
      // 쉼표로 구분된 문자열인 경우
      if (nicknamelist.includes(',')) {
        return nicknamelist.split(',').map(item => item.trim()).filter(item => item.length > 0)
      }
      
      // 단일 문자열인 경우
      return nicknamelist.trim() ? [nicknamelist.trim()] : []
    } catch (error) {
      console.warn('Failed to parse nicknamelist:', nicknamelist, error)
      return []
    }
  }
  
  return []
}

/**
 * obligation 필드들을 객체 형식으로 변환
 * 
 * @param licenseData - 업스트림에서 받은 라이선스 정보
 * @returns 변환된 obligations 객체
 */
export function transformObligations(licenseData: any) {
  const parseNotificationValue = (value: string | boolean | undefined | null): boolean => {
    if (typeof value === 'boolean') return value
    if (typeof value === 'string') {
      const normalized = value.toLowerCase().trim()
      return normalized === 'y' || normalized === 'yes' || normalized === 'true' || normalized === '1'
    }
    return false
  }

  const parseDisclosingSrcValue = (value: string | undefined | null): ObligationDisclosingSrc => {
    if (!value) return 'UNSPECIFIED'
    
    const validValues: ObligationDisclosingSrc[] = [
      'NONE', 'ORIGINAL', 'FILE', 'MODULE', 'LIBRARY', 
      'DERIVATIVE WORK', 'EXECUTABLE', 'DATA', 'SOFTWARE USING THIS', 'UNSPECIFIED'
    ]
    
    const upperValue = value.toUpperCase() as ObligationDisclosingSrc
    return validValues.includes(upperValue) ? upperValue : 'UNSPECIFIED'
  }

  const parseIncludingLicenseValue = (value: string | undefined | null): ObligationIncludingLicense => {
    if (!value) return 'UNSPECIFIED'
    
    const validValues: ObligationIncludingLicense[] = [
      'REQUIRED', 'OPTIONAL', 'RECOMMENDED', 'NONE', 'UNSPECIFIED'
    ]
    
    const upperValue = value.toUpperCase() as ObligationIncludingLicense
    return validValues.includes(upperValue) ? upperValue : 'UNSPECIFIED'
  }

  return {
    disclosing_src: parseDisclosingSrcValue(licenseData.obligation_disclosing_src),
    notification: parseNotificationValue(licenseData.obligation_notification),  
    including_license: parseIncludingLicenseValue(licenseData.obligation_including_license)
  }
}

/**
 * 라이선스 상세 정보의 임시 변환을 수행
 * 
 * TODO: 업스트림 API가 수정되면 이 함수의 변환 로직을 단순화하거나 제거하세요.
 * 
 * @param licenseDetail - 업스트림에서 받은 라이선스 상세 정보
 * @returns 변환된 라이선스 정보
 */
export function transformLicenseDetail(licenseDetail: any) {
  return {
    ...licenseDetail,
    // nicknamelist 문자열을 배열로 변환
    nicknamelist: parseNicknameList(licenseDetail.nicknamelist),
    // obligations 객체로 변환
    obligations: transformObligations(licenseDetail)
  }
}

/**
 * 배열을 지정된 크기의 청크로 분할
 * 
 * @param array - 분할할 배열
 * @param chunkSize - 청크 크기
 * @returns 청크 배열
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

/**
 * 병렬 처리를 위한 비동기 배치 처리
 * 
 * @param items - 처리할 아이템 배열
 * @param processor - 각 아이템을 처리할 비동기 함수
 * @param batchSize - 동시에 처리할 배치 크기 (기본값: 5)
 * @returns 처리된 결과 배열
 */
export async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 5
): Promise<R[]> {
  const chunks = chunkArray(items, batchSize)
  const results: R[] = []
  
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(processor))
    results.push(...chunkResults)
  }
  
  return results
}