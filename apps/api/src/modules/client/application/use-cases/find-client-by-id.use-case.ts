import { Inject, Injectable } from '@nestjs/common'
import { ClientEntity } from '../../domain/entities'
import { IClientRepository, CLIENT_REPOSITORY } from '../../domain/repositories'
import { ClientNotFoundException } from '../../domain/exceptions'
import {
  ICacheService,
  CACHE_SERVICE,
  CacheKeyBuilder,
  DEFAULT_TTL,
} from '../../../../common/cache'

@Injectable()
export class FindClientByIdUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(tenantId: string, id: string): Promise<ClientEntity> {
    const cacheKey = CacheKeyBuilder.forEntity(tenantId, 'client', id)
    const cached = await this.cache.get<ClientEntity>(cacheKey)
    if (cached) return cached

    const client = await this.clientRepository.findById(tenantId, id)

    if (!client) {
      throw new ClientNotFoundException(id)
    }

    const tag = CacheKeyBuilder.forTag(tenantId, 'clients')
    await this.cache.set(cacheKey, client, DEFAULT_TTL.ENTITY)
    await this.cache.addToTag(tag, cacheKey)

    return client
  }
}
