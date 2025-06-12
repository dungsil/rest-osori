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
      "spdx_identifier": "MIT",
      "osi_approval": true,
      "obligations": {
        "disclosing_src": "NONE",
        "notification": true,
        "including_license": "REQUIRED"
      },
      "nicknames": ["MIT", "Expat License"]
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
  "spdx_identifier": "MIT",
  "osi_approval": true,
  "license_text": "MIT License\n\nCopyright (c) [year] [fullname]\n\nPermission is hereby granted...",
  "obligations": {
    "disclosing_src": "NONE",
    "notification": true,
    "including_license": "REQUIRED"
  },
  "nicknames": ["MIT", "Expat License"]
}
```

</details>

## 라이선스

이 프로젝트는 [MIT 라이선스](./LICENSE) 하에 배포됩니다.

## 크레딧

- [오소리 프로젝트](https://olis.or.kr/osori) - 원본 API 제공
- [unjs/ungh](https://github.com/unjs/ungh) - 프로젝트 영감 💡
