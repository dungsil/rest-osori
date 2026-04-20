# Rest OSORI API

> RESTful 한 오소리 API 프록시

## 사용법

- [API 문서](https://rest-osori.vercel.app)

`Rest OSORI`는 각 사용자 별 설치형으로 사용하는 걸 권장하나
데모 및 일시 사용 등을 이유로 공개 프록시를 제공합니다.

1. `https://global-1.prod.osori.kyog.net/api`
2. `https://global-2.prod.osori.kyog.net/api`
3. `https://global-3.prod.osori.kyog.net/api`

## API

### 라이선스 목록

**GET** `/api/licenses`

```bash
curl "/api/licenses?q=name:MIT&page=1&size=10"
```

<details>
<summary>응답 예시</summary>

```json
{
  "total_count": 150,
  "items": [
    {
      "id": 1,
      "name": "MIT License",
      "spdx": "MIT",
      "osi_approval": true,
      "obligations": {
        "disclosing_src": "NONE",
        "notification": true,
        "including_license": "REQUIRED"
      },
      "nicknames": [
        "MIT",
        "Expat License"
      ]
    }
  ]
}
```

</details>

### 라이선스 상세

**GET** `/api/licenses/{id}`

```bash
curl "/api/licenses/1"
```

<details>
<summary>응답 예시</summary>

```json
{
  "id": 1,
  "name": "MIT License",
  "spdx": "MIT",
  "osi_approval": true,
  "license_text": "MIT License\n\nCopyright (c) [year] [fullname]\n\nPermission is hereby granted...",
  "obligations": {
    "disclosing_src": "NONE",
    "notification": true,
    "including_license": "REQUIRED"
  },
  "nicknames": [
    "MIT",
    "Expat License"
  ]
}
```

</details>

### OSS 목록

**GET** `/api/oss`

```bash
curl "/api/oss?q=name:spring-boot&page=1&size=10"
```

<details>
<summary>응답 예시</summary>

```json
{
  "total_count": 2,
  "items": [
    {
      "id": 123,
      "name": "spring-boot",
      "version_license_diff": false,
      "purl": "pkg:maven/org.springframework.boot/spring-boot",
      "versions": [
        {
          "id": 456,
          "version": "3.2.0",
          "declared_licenses": "Apache-2.0",
          "detected_licenses": null,
          "restrictions": null
        }
      ]
    }
  ]
}
```

</details>

### OSS 상세

**GET** `/api/oss/{id}`

```bash
# OSS ID, 이름, 또는 다운로드 위치로 조회 가능
curl "/api/oss/spring-boot"
curl "/api/oss/123"
```

<details>
<summary>응답 예시</summary>

```json
{
  "id": 456,
  "version": "3.2.0",
  "description": "Spring Boot helps you to create Spring-powered, production-grade applications...",
  "description_ko": null,
  "attribution": null,
  "license_combination": "AND",
  "release_date": "2023-11-23",
  "created_at": "2023-10-01 09:00:00",
  "modified_at": "2023-11-23 12:00:00",
  "copyright": "Copyright 2012-2023 the original author or authors.",
  "declared_licenses": [
    "Apache-2.0"
  ],
  "detected_licenses": null,
  "restrictions": null
}
```

</details>

## 라이선스

이 프로젝트는 [MIT 라이선스](./LICENSE) 하에 배포됩니다.

## 크레딧

- [오소리 프로젝트](https://olis.or.kr/osori) - 원본 API 제공
- [unjs/ungh](https://github.com/unjs/ungh) - 프로젝트 영감 💡
