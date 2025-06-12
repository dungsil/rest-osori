import * as v from 'valibot'

/**
 * 페이지네이션 응답 인터페이스
 * 
 * @template T - 아이템 타입
 */
export interface Page<T = unknown> {
  /** 전체 아이템 수 */
  total_count: number
  /** 아이템 목록 */
  items: T[]
}

/**
 * 페이지네이션 쿼리 검증 스키마
 */
export const pageSpec = v.object({
  /** 페이지 번호 (1-2000) */
  page: v.optional(v.pipe(v.union([v.string(), v.number()]), v.transform(Number), v.number(), v.minValue(1), v.maxValue(2000)), 1),
  /** 페이지 크기 (1-100) */
  size: v.optional(v.pipe(v.union([v.string(), v.number()]), v.transform(Number), v.number(), v.minValue(1), v.maxValue(100)), 20)
})

/**
 * 페이지네이션 쿼리 타입
 */
export type PageSpec = v.InferOutput<typeof pageSpec>
