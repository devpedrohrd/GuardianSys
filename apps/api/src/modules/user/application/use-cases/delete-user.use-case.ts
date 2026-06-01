import { Inject, Injectable } from '@nestjs/common'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories'
import {
  UserNotFoundException,
  InsufficientPermissionsException,
} from '../../domain/exceptions'
import { ICacheService, CACHE_SERVICE, CacheKeyBuilder } from '../../../../common/cache'

@Injectable()
export class DeleteUserUseCase {
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
  ): Promise<void> {
    const executor = await this.userRepository.findById(tenantId, executorId)

    if (!executor) {
      throw new InsufficientPermissionsException()
    }

    if (
      id === executorId &&
      executor.role !== 'ADMIN' &&
      executor.role !== 'SUPER_ADMIN'
    ) {
      throw new InsufficientPermissionsException()
    }

    if (
      id !== executorId &&
      executor.role !== 'ADMIN' &&
      executor.role !== 'SUPER_ADMIN'
    ) {
      throw new InsufficientPermissionsException()
    }

    const existing = await this.userRepository.findById(tenantId, id)

    if (!existing) {
      throw new UserNotFoundException(id)
    }

    await this.userRepository.delete(tenantId, id)

    const entityKey = CacheKeyBuilder.forEntity(tenantId, 'user', id)
    const tag = CacheKeyBuilder.forTag(tenantId, 'users')
    await this.cache.del(entityKey)
    await this.cache.invalidateByTag(tag)
  }
}
