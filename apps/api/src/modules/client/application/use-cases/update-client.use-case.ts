import { Inject, Injectable } from '@nestjs/common'
import { UpdateClientInput } from '@repo/api'
import { ClientEntity } from '../../domain/entities'
import { IClientRepository, CLIENT_REPOSITORY } from '../../domain/repositories'
import { ClientNotFoundException } from '../../domain/exceptions'
import { ICacheService, CACHE_SERVICE, CacheKeyBuilder } from '../../../../common/cache'

@Injectable()
export class UpdateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(
    tenantId: string,
    id: string,
    input: UpdateClientInput,
  ): Promise<ClientEntity> {
    const client = await this.clientRepository.findById(tenantId, id)

    if (!client) {
      throw new ClientNotFoundException(id)
    }

    const result = await this.clientRepository.update(tenantId, id, input)

    const entityKey = CacheKeyBuilder.forEntity(tenantId, 'client', id)
    const tag = CacheKeyBuilder.forTag(tenantId, 'clients')
    await this.cache.del(entityKey)
    await this.cache.invalidateByTag(tag)

    return result
  }
}
