import { Inject, Injectable } from '@nestjs/common'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories'
import { InsufficientPermissionsException } from '../../domain/exceptions'
import { SearchUserFilter, PaginatedResponse } from '@repo/api'
import { UserEntity } from '../../domain/entities'

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    tenantId: string,
    filter: SearchUserFilter,
    executorId: string,
  ): Promise<PaginatedResponse<UserEntity>> {
    const executor = await this.userRepository.findById(tenantId, executorId)

    if (!executor) {
      throw new InsufficientPermissionsException()
    }

    if (!executor.canViewOthers) {
      filter.id = executorId
    }

    return this.userRepository.findAll(tenantId, filter)
  }
}
