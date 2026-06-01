export interface ICacheService {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttl?: number): Promise<void>
  del(key: string): Promise<void>
  invalidateByTag(tag: string): Promise<number>
  addToTag(tag: string, key: string): Promise<void>
  isHealthy(): Promise<boolean>
}
