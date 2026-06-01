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
import { ICacheService, CACHE_SERVICE, CacheKeyBuilder } from '../../../../common/cache'

@Injectable()
export class UpdateCondominiumUseCase {
  constructor(
    @Inject(CONDOMINIUM_REPOSITORY)
    private readonly condominiumRepository: ICondominiumRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
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

    const result = await this.condominiumRepository.update(id, input, user.tenantId)

    const entityKey = CacheKeyBuilder.forEntity(user.tenantId as string, 'condominium', id)
    const tag = CacheKeyBuilder.forTag(user.tenantId as string, 'condominiums')
    await this.cache.del(entityKey)
    await this.cache.invalidateByTag(tag)

    return result
  }
}
