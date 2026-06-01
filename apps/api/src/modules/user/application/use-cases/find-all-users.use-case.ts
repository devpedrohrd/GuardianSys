import { Inject, Injectable } from '@nestjs/common'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories'
import { InsufficientPermissionsException } from '../../domain/exceptions'
import { SearchUserFilter, PaginatedResponse } from '@repo/api'
import { UserEntity } from '../../domain/entities'
import {
  ICacheService,
  CACHE_SERVICE,
  CacheKeyBuilder,
  DEFAULT_TTL,
} from '../../../../common/cache'

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(
    tenantId: string,
    filter: SearchUserFilter,
    executorId: string,
  ): Promise<PaginatedResponse<UserEntity>> {
    const executorKey = CacheKeyBuilder.forEntity(tenantId, 'user', executorId)
    let executor = await this.cache.get<UserEntity>(executorKey)

    if (!executor) {
      executor = await this.userRepository.findById(tenantId, executorId)
      if (!executor) {
        throw new InsufficientPermissionsException()
      }
      const tag = CacheKeyBuilder.forTag(tenantId, 'users')
      await this.cache.set(executorKey, executor, DEFAULT_TTL.ENTITY)
      await this.cache.addToTag(tag, executorKey)
    }

    if (!executor.canViewOthers) {
      filter.id = executorId
    }

    const cacheKey = CacheKeyBuilder.forList(tenantId, 'users', filter as Record<string, unknown>)
    const cached = await this.cache.get<PaginatedResponse<UserEntity>>(cacheKey)
    if (cached) return cached

    const result = await this.userRepository.findAll(tenantId, filter)

    const tag = CacheKeyBuilder.forTag(tenantId, 'users')
    await this.cache.set(cacheKey, result, DEFAULT_TTL.LIST)
    await this.cache.addToTag(tag, cacheKey)
    return result
  }
}
