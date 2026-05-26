import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import {
  ICondominiumRepository,
  CONDOMINIUM_REPOSITORY,
} from '../../domain/repositories/condominium.repository.interface'
import {
  CondominiumNotBelongsToTenantException,
  CondominiumNotFoundException,
} from '../../domain/exceptions/condominium.exception'
import { AuthenticatedUser } from '../../../../common/interfaces'

@Injectable()
export class DeleteCondominiumUseCase {
  constructor(
    @Inject(CONDOMINIUM_REPOSITORY)
    private readonly condominiumRepository: ICondominiumRepository,
  ) {}

  async execute(id: string, user: AuthenticatedUser): Promise<void> {
    const condominium = await this.condominiumRepository.findById(id)
    if (!condominium) {
      throw new CondominiumNotFoundException(id)
    }

    if (condominium.tenantId !== user.tenantId) {
      throw new CondominiumNotBelongsToTenantException(id)
    }
    await this.condominiumRepository.delete(id, user.tenantId)
  }
}
