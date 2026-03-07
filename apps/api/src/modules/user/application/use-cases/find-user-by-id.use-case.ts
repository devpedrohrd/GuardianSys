import { Inject, Injectable } from '@nestjs/common'
import { UserEntity } from '../../domain/entities'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories'
import { UserNotFoundException } from '../../domain/exceptions'

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(tenantId: string, id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(tenantId, id)

    if (!user) {
      throw new UserNotFoundException(id)
    }

    return user
  }
}
