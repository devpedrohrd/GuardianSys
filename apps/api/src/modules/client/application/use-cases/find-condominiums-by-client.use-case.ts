import { Inject, Injectable } from '@nestjs/common'
import { SearchClientCondominiumFilter, PaginatedResponse, ClientCondominium } from '@repo/api'
import { IClientRepository, CLIENT_REPOSITORY } from '../../domain/repositories'
import { ClientNotFoundException } from '../../domain/exceptions'
import { ICacheService, CACHE_SERVICE, CacheKeyBuilder, DEFAULT_TTL } from '../../../../common/cache'

@Injectable()
export class FindCondominiumsByClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(
    tenantId: string,
    clientId: string,
    filter: SearchClientCondominiumFilter,
  ): Promise<PaginatedResponse<ClientCondominium>> {
    const client = await this.clientRepository.findById(tenantId, clientId)
    if (!client) {
      throw new ClientNotFoundException(clientId)
    }

    const cacheKey = CacheKeyBuilder.forList(tenantId, 'client-condominiums', {
      ...filter,
      clientId,
    })
    const cached = await this.cache.get<PaginatedResponse<ClientCondominium>>(cacheKey)
    if (cached) return cached

    const result = await this.clientRepository.findCondominiumsByClientId(
      tenantId,
      clientId,
      filter,
    )

    const tag = CacheKeyBuilder.forTag(tenantId, 'client-condominiums')
    await this.cache.set(cacheKey, result, DEFAULT_TTL.LIST)
    await this.cache.addToTag(tag, cacheKey)

    return result
  }
}
