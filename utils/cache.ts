import type { CacheOptions } from 'nitropack'

export const createCacheOptions = (name: string, validate: CacheOptions['validate']): CacheOptions => ({
  name,
  integrity: 'cb2RkuNE4G',
  validate,
  swr: false,
  maxAge: 60 * 60 * 6, // 6 hours
  staleMaxAge: 60 * 60 * 12, // 12 hours
})
