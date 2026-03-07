import { Inject, Injectable } from '@nestjs/common'
import {
  IUserRepository,
  USER_REPOSITORY,
  SearchUsersFilter,
  PaginatedUsers,
} from '../../domain/repositories'

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    tenantId: string,
    filter: SearchUsersFilter,
  ): Promise<PaginatedUsers> {
    return this.userRepository.findAll(tenantId, filter)
  }
}
