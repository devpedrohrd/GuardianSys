import { Inject, Injectable } from '@nestjs/common'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories'
import { UserNotFoundException, InsufficientPermissionsException } from '../../domain/exceptions'

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(tenantId: string, id: string, executorId: string): Promise<void> {
    const executor = await this.userRepository.findById(tenantId, executorId)
    
    if (!executor) {
      throw new InsufficientPermissionsException()
    }

    if (id === executorId && executor.role !== 'ADMIN' && executor.role !== 'SUPER_ADMIN') {
      throw new InsufficientPermissionsException()
    }

    if (id !== executorId && executor.role !== 'ADMIN' && executor.role !== 'SUPER_ADMIN') {
      throw new InsufficientPermissionsException()
    }

    const existing = await this.userRepository.findById(tenantId, id)

    if (!existing) {
      throw new UserNotFoundException(id)
    }

    await this.userRepository.delete(tenantId, id)
  }
}
