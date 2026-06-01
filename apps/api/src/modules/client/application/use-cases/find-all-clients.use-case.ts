import { Inject, Injectable } from '@nestjs/common'
import { PaginatedResponse, SearchClientFilter } from '@repo/api'
import { ClientEntity } from '../../domain/entities'
import { IClientRepository, CLIENT_REPOSITORY } from '../../domain/repositories'
import {
  ICacheService,
  CACHE_SERVICE,
  CacheKeyBuilder,
  DEFAULT_TTL,
} from '../../../../common/cache'

@Injectable()
export class FindAllClientsUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(
    tenantId: string,
    filter: SearchClientFilter,
  ): Promise<PaginatedResponse<ClientEntity>> {
    const cacheKey = CacheKeyBuilder.forList(tenantId, 'clients', filter as unknown as Record<string, unknown>)
    const cached = await this.cache.get<PaginatedResponse<ClientEntity>>(cacheKey)
    if (cached) return cached

    const result = await this.clientRepository.findAll(tenantId, filter)

    const tag = CacheKeyBuilder.forTag(tenantId, 'clients')
    await this.cache.set(cacheKey, result, DEFAULT_TTL.LIST)
    await this.cache.addToTag(tag, cacheKey)

    return result
  }
}
