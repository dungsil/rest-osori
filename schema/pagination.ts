import * as v from 'valibot'

export interface Page<T = unknown> {
  total_count: number
  items: T[]
}

export const pageSpec = v.object({
  page: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(2000)), 1),
  size: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100)), 20)
})

export type PageSpec = v.InferOutput<typeof pageSpec>
