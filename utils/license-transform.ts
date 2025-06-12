/**
 * 라이선스 데이터 변환 유틸리티
 * 
 * 이 파일은 업스트림 OSORI API의 데이터 형식 불일치를 해결하기 위한 임시 변환 로직을 포함합니다.
 * 업스트림에서 수정되면 해당 함수들을 제거할 수 있습니다.
 */

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
    nicknamelist: parseNicknameList(licenseDetail.nicknamelist)
  }
}