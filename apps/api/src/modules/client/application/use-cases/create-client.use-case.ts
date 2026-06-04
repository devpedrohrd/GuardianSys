import { Inject, Injectable } from '@nestjs/common'
import { CreateClientInput } from '@repo/api'
import { ClientEntity } from '../../domain/entities'
import { IClientRepository, CLIENT_REPOSITORY } from '../../domain/repositories'
import { ClientAlreadyExistsException, CondominiumNotFoundException } from '../../domain/exceptions'
import { ICacheService, CACHE_SERVICE, CacheKeyBuilder } from '../../../../common/cache'

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(input: CreateClientInput): Promise<ClientEntity> {
    const existingClient = await this.clientRepository.findByName(
      input.tenantId,
      input.name,
    )
    if (existingClient) {
      throw new ClientAlreadyExistsException(input.name)
    }

    for (const condominiumId of input.condominiumIds) {
      const exists = await this.clientRepository.condominiumExists(
        input.tenantId,
        condominiumId,
      )
      if (!exists) {
        throw new CondominiumNotFoundException(condominiumId)
      }
    }

    const client = await this.clientRepository.create(input)

    const tag = CacheKeyBuilder.forTag(input.tenantId, 'clients')
    await this.cache.invalidateByTag(tag)

    return client
  }
}
