import { Inject, Injectable } from '@nestjs/common'
import { UpdateUserInput } from '@repo/api'
import * as bcrypt from 'bcryptjs'
import { UserEntity } from '../../domain/entities'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories'
import {
  UserNotFoundException,
  InsufficientPermissionsException,
} from '../../domain/exceptions'

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
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

    return this.userRepository.update(tenantId, id, updateData)
  }
}
