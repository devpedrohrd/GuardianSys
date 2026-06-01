import { Inject, Injectable } from '@nestjs/common'
import { UpdateUserInput } from '@repo/api'
import * as bcrypt from 'bcryptjs'
import { UserEntity } from '../../domain/entities'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories'
import {
  UserNotFoundException,
  InsufficientPermissionsException,
} from '../../domain/exceptions'
import { ICacheService, CACHE_SERVICE, CacheKeyBuilder } from '../../../../common/cache'

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(
    tenantId: string,
    id: string,
    input: UpdateUserInput,
    executorId: string,
  ): Promise<UserEntity> {
    if (id !== executorId) {
      const executor = await this.userRepository.findById(tenantId, executorId)
      if (!executor || !executor.canEditOthers) {
        throw new InsufficientPermissionsException()
      }
    }

    const existing = await this.userRepository.findById(tenantId, id)

    if (!existing) {
      throw new UserNotFoundException(id)
    }

    const updateData = { ...input }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10)
    }

    const user = await this.userRepository.update(tenantId, id, updateData)

    const entityKey = CacheKeyBuilder.forEntity(tenantId, 'user', id)
    const tag = CacheKeyBuilder.forTag(tenantId, 'users')
    await this.cache.del(entityKey)
    await this.cache.invalidateByTag(tag)

    return user
  }
}
