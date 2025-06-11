import { version } from './package.json'

export default defineNitroConfig({
  compatibilityDate: '2025-06-01',

  imports: {
    dirs: ['./services/*', './schema/*'],
  },

  storage: {
    cache: {
      driver: 'memory'
    }
  },

  devStorage: {
    cache: {
      driver: 'memory'
    }
  },

  experimental: {
    asyncContext: true,
    openAPI: true,
    typescriptBundlerResolution: true,
  },

  openAPI: {
    production: 'prerender',
    meta: {
      title: 'Rest OSORI API',
      version,
      description: [
        '저작권위원회 오소리(OSORI) API 프록시',
        '오소리 API를 프록시하여 캐싱 및 응답 속도를 최적화하고 RESTful-Like 한 API를 제공해 DX를 향상시킵니다.',
        '\n',
        '## API 호환성 가이드',
        '| Rest OSORI API | 공식 오소리 API |',
        '|:--------------:|:--------------:|',
        '|      v1.0      |       v2       |',
        '\n',
        '## 참고',
        ' - [오소리 공식 API 문서](https://olis.or.kr:13443/apiService/guide.do)',
        ' - [오소리 공식 OpenAPI 문서](https://www.olis.or.kr:15443/swagger-ui/index.html)'
      ].join('\n'),
    },
    ui: {
      scalar: {
        route: '/'
      }
    }
  }
})
