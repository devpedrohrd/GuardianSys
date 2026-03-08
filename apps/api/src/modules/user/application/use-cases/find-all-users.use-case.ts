import { Inject, Injectable } from '@nestjs/common'
import {
  IUserRepository,
  USER_REPOSITORY,
  PaginatedUsers,
} from '../../domain/repositories'
import { InsufficientPermissionsException } from '../../domain/exceptions'
import { SearchUserFilter } from '@repo/api'

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
  ): Promise<PaginatedUsers> {
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
