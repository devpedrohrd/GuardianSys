import { Inject, Injectable } from '@nestjs/common'
import { CreateClientCondominiumInput } from '@repo/api'
import { IClientRepository, CLIENT_REPOSITORY } from '../../domain/repositories'
import {
  ClientNotFoundException,
  CondominiumNotFoundException,
  ClientCondominiumAlreadyExistsException,
} from '../../domain/exceptions'
import { ICacheService, CACHE_SERVICE, CacheKeyBuilder } from '../../../../common/cache'

@Injectable()
export class AddClientToCondominiumUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(tenantId: string, input: CreateClientCondominiumInput): Promise<void> {
    const client = await this.clientRepository.findById(tenantId, input.clientId)
    if (!client) {
      throw new ClientNotFoundException(input.clientId)
    }

    for (const condominiumId of input.condominiumIds) {
      const condominiumExists = await this.clientRepository.condominiumExists(
        tenantId,
        condominiumId,
      )
      if (!condominiumExists) {
        throw new CondominiumNotFoundException(condominiumId)
      }

      const existing = await this.clientRepository.findClientCondominium(
        input.clientId,
        condominiumId,
      )
      if (existing) {
        throw new ClientCondominiumAlreadyExistsException(
          input.clientId,
          condominiumId,
        )
      }

      await this.clientRepository.relateClientToCondominium(
        input.clientId,
        condominiumId,
      )
    }

    const tag = CacheKeyBuilder.forTag(tenantId, 'client-condominiums')
    await this.cache.invalidateByTag(tag)
  }
}
