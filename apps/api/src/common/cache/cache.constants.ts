export const CACHE_SERVICE = Symbol('ICacheService')

export const DEFAULT_TTL = {
  ENTITY: 300, // 5 minutes
  LIST: 120, // 2 minutes
  AGGREGATION: 60, // 1 minute
  STATIC: 1800, // 30 minutes
} as const

export const CACHE_PREFIX = 'cache'
export const TAG_PREFIX = 'tag'
