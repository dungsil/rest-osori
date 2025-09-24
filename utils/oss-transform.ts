/**
 * OSS 데이터 변환 유틸리티
 * 
 * 업스트림 OSORI API의 OSS 데이터를 REST-like 형식으로 변환합니다.
 */

import type { OssInfo, OssVersionInfo, OssVersionDetail } from '~/schema/oss'
import type { OsoriOssMaster, OsoriOssVersion, OsoriOssVersionDetail } from '~/schema/osori'

/**
 * 업스트림 OSS 마스터 데이터를 REST-like 형식으로 변환
 * 
 * @param ossMaster - 업스트림에서 받은 OSS 마스터 데이터
 * @returns 변환된 OSS 정보
 */
export function transformOssMaster(ossMaster: OsoriOssMaster): OssInfo {
  return {
    id: ossMaster.oss_master_id,
    name: ossMaster.name,
    version_license_diff: ossMaster.version_license_diff,
    purl: ossMaster.purl,
    versions: ossMaster.version?.map(transformOssVersion) || []
  }
}

/**
 * 업스트림 OSS 버전 데이터를 REST-like 형식으로 변환
 * 
 * @param ossVersion - 업스트림에서 받은 OSS 버전 데이터
 * @returns 변환된 OSS 버전 정보
 */
export function transformOssVersion(ossVersion: OsoriOssVersion): OssVersionInfo {
  return {
    id: ossVersion.oss_version_id,
    version: ossVersion.version,
    declared_licenses: ossVersion.declaredLicenseList,
    detected_licenses: ossVersion.detectedLicenseList,
    restrictions: ossVersion.restrictionList
  }
}

/**
 * 업스트림 OSS 버전 상세 데이터를 REST-like 형식으로 변환
 * 
 * @param ossVersionDetail - 업스트림에서 받은 OSS 버전 상세 데이터
 * @returns 변환된 OSS 버전 상세 정보
 */
export function transformOssVersionDetail(ossVersionDetail: OsoriOssVersionDetail): OssVersionDetail {
  return {
    id: ossVersionDetail.oss_version_id,
    version: ossVersionDetail.version,
    description: ossVersionDetail.description,
    description_ko: ossVersionDetail.description_ko,
    attribution: ossVersionDetail.attribution,
    license_combination: ossVersionDetail.license_combination,
    release_date: ossVersionDetail.release_date,
    created_at: ossVersionDetail.created_date,
    modified_at: ossVersionDetail.modified_date,
    copyright: ossVersionDetail.copyright,
    declared_licenses: ossVersionDetail.declaredLicenseList,
    detected_licenses: ossVersionDetail.detectedLicenseList,
    restrictions: ossVersionDetail.restrictionList
  }
}