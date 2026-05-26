import { Injectable, Inject } from '@nestjs/common'
import {
  ICondominiumRepository,
  CONDOMINIUM_REPOSITORY,
} from '../../domain/repositories/condominium.repository.interface'
import { Condominium } from '@repo/api'
import {
  CondominiumNotBelongsToTenantException,
  CondominiumNotFoundException,
} from '../../domain/exceptions/condominium.exception'
import { AuthenticatedUser } from '../../../../common/interfaces'
import { UpdateCondominiumDto } from '../../presentation/dtos'

@Injectable()
export class UpdateCondominiumUseCase {
  constructor(
    @Inject(CONDOMINIUM_REPOSITORY)
    private readonly condominiumRepository: ICondominiumRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateCondominiumDto,
    user: AuthenticatedUser,
  ): Promise<Condominium> {
    const condominium = await this.condominiumRepository.findById(id)
    if (!condominium) {
      throw new CondominiumNotFoundException(id)
    }

    if (condominium.tenantId !== user.tenantId) {
      throw new CondominiumNotBelongsToTenantException(id)
    }

    return await this.condominiumRepository.update(id, input, user.tenantId)
  }
}
