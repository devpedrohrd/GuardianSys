import { Inject, Injectable } from '@nestjs/common'
import { RemoveClientCondominiumInput } from '@repo/api'
import { IClientRepository, CLIENT_REPOSITORY } from '../../domain/repositories'
import { ClientCondominiumNotFoundException } from '../../domain/exceptions'
import { ICacheService, CACHE_SERVICE, CacheKeyBuilder } from '../../../../common/cache'

@Injectable()
export class RemoveClientFromCondominiumUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(tenantId: string, input: RemoveClientCondominiumInput): Promise<void> {
    const existing = await this.clientRepository.findClientCondominium(
      input.clientId,
      input.condominiumId,
    )

    if (!existing) {
      throw new ClientCondominiumNotFoundException(
        input.clientId,
        input.condominiumId,
      )
    }

    await this.clientRepository.removeClientFromCondominium(
      input.clientId,
      input.condominiumId,
    )

    const tag = CacheKeyBuilder.forTag(tenantId, 'client-condominiums')
    await this.cache.invalidateByTag(tag)
  }
}
