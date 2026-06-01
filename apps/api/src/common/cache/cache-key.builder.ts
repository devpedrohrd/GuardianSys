import { createHash } from 'crypto'
import { CACHE_PREFIX, TAG_PREFIX } from './cache.constants'

export class CacheKeyBuilder {
  static forEntity(
    tenantId: string,
    resource: string,
    id: string,
  ): string {
    return `${CACHE_PREFIX}:${tenantId}:${resource}:${id}`
  }

  static forList(
    tenantId: string,
    resource: string,
    params: Record<string, unknown>,
  ): string {
    const hash = CacheKeyBuilder.hashParams(params)
    return `${CACHE_PREFIX}:${tenantId}:${resource}:list:${hash}`
  }

  static forTag(tenantId: string, resource: string): string {
    return `${TAG_PREFIX}:${tenantId}:${resource}`
  }

  static hashParams(params: Record<string, unknown>): string {
    const sorted = JSON.stringify(params, Object.keys(params).sort())
    return createHash('sha256').update(sorted).digest('hex').slice(0, 12)
  }
}
