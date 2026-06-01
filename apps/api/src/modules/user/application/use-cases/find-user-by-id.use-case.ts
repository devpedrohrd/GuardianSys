import { Inject, Injectable } from '@nestjs/common'
import { UserEntity } from '../../domain/entities'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories'
import {
  UserNotFoundException,
  InsufficientPermissionsException,
} from '../../domain/exceptions'
import {
  ICacheService,
  CACHE_SERVICE,
  CacheKeyBuilder,
  DEFAULT_TTL,
} from '../../../../common/cache'

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(
    tenantId: string,
    id: string,
    executorId: string,
  ): Promise<UserEntity> {
    const cacheKey = CacheKeyBuilder.forEntity(tenantId, 'user', id)
    const cached = await this.cache.get<UserEntity>(cacheKey)

    if (cached) {
      if (id !== executorId) {
        const executor = await this.userRepository.findById(tenantId, executorId)
        if (!executor || !executor.canViewOthers) {
          throw new InsufficientPermissionsException()
        }
      }
      return cached
    }

    const user = await this.userRepository.findById(tenantId, id)

    if (!user) {
      throw new UserNotFoundException(id)
    }

    if (id !== executorId) {
      const executor = await this.userRepository.findById(tenantId, executorId)
      if (!executor || !executor.canViewOthers) {
        throw new InsufficientPermissionsException()
      }
    }

    const tag = CacheKeyBuilder.forTag(tenantId, 'users')
    await this.cache.set(cacheKey, user, DEFAULT_TTL.ENTITY)
    await this.cache.addToTag(tag, cacheKey)

    return user
  }
}
