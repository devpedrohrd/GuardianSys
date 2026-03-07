import { Inject, Injectable } from '@nestjs/common'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories'
import { UserNotFoundException } from '../../domain/exceptions'

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(tenantId: string, id: string): Promise<void> {
    const existing = await this.userRepository.findById(tenantId, id)

    if (!existing) {
      throw new UserNotFoundException(id)
    }

    await this.userRepository.delete(tenantId, id)
  }
}
