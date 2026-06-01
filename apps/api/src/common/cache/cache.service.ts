import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'
import { ICacheService } from './cache.interface'
import { DEFAULT_TTL } from './cache.constants'

@Injectable()
export class CacheService implements ICacheService, OnModuleInit, OnModuleDestroy {
  private readonly redis: Redis
  private readonly logger = new Logger(CacheService.name)

  private hits = 0
  private misses = 0
  private invalidations = 0

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL as string, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) return null
        return Math.min(times * 200, 2000)
      },
      lazyConnect: true,
    })

    this.redis.on('error', (err) => {
      this.logger.error(`Redis connection error: ${err.message}`)
    })
  }

  async onModuleInit() {
    try {
      await this.redis.connect()
      this.logger.log('Redis connected successfully')
    } catch (err) {
      this.logger.error(`Redis connection failed: ${(err as Error).message}`)
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key)
      this.logger.debug(`Cache GET for key "${key}": ${data ? 'HIT' : 'MISS'}`)
      if (data) {
        this.hits++
        return JSON.parse(data) as T
      }
      this.misses++
      return null
    } catch (err) {
      this.logger.warn(`Cache GET failed for key "${key}": ${(err as Error).message}`)
      this.misses++
      return null
    }
  }

  async set<T>(key: string, value: T, ttl = DEFAULT_TTL.ENTITY): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttl)
    } catch (err) {
      this.logger.warn(`Cache SET failed for key "${key}": ${(err as Error).message}`)
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key)
    } catch (err) {
      this.logger.warn(`Cache DEL failed for key "${key}": ${(err as Error).message}`)
    }
  }

  async addToTag(tag: string, key: string): Promise<void> {
    try {
      await this.redis.sadd(tag, key)
    } catch (err) {
      this.logger.warn(`Cache SADD failed for tag "${tag}": ${(err as Error).message}`)
    }
  }

  async invalidateByTag(tag: string): Promise<number> {
    try {
      const keys = await this.redis.smembers(tag)
      if (keys.length === 0) return 0

      const pipeline = this.redis.pipeline()
      for (const key of keys) {
        pipeline.del(key)
      }
      pipeline.del(tag)
      await pipeline.exec()

      this.invalidations++
      this.logger.debug(
        `Invalidated ${keys.length} keys for tag "${tag}"`,
      )
      return keys.length
    } catch (err) {
      this.logger.warn(`Cache invalidation failed for tag "${tag}": ${(err as Error).message}`)
      return 0
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      const result = await this.redis.ping()
      return result === 'PONG'
    } catch {
      return false
    }
  }

  getMetrics() {
    return {
      hits: this.hits,
      misses: this.misses,
      invalidations: this.invalidations,
      hitRate: this.hits + this.misses > 0
        ? this.hits / (this.hits + this.misses)
        : 0,
    }
  }

  async onModuleDestroy() {
    await this.redis.quit()
  }
}
