import { Inject, Injectable } from '@nestjs/common'
import { SearchClientCondominiumFilter, PaginatedResponse, ClientCondominium } from '@repo/api'
import { IClientRepository, CLIENT_REPOSITORY } from '../../domain/repositories'
import { ICacheService, CACHE_SERVICE, CacheKeyBuilder, DEFAULT_TTL } from '../../../../common/cache'

@Injectable()
export class FindClientsByCondominiumUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(
    tenantId: string,
    condominiumId: string,
    filter: SearchClientCondominiumFilter,
  ): Promise<PaginatedResponse<ClientCondominium>> {
    const cacheKey = CacheKeyBuilder.forList(tenantId, 'client-condominiums', {
      ...filter,
      condominiumId,
    })
    const cached = await this.cache.get<PaginatedResponse<ClientCondominium>>(cacheKey)
    if (cached) return cached

    const result = await this.clientRepository.findClientsByCondominiumId(
      tenantId,
      condominiumId,
      filter,
    )

    const tag = CacheKeyBuilder.forTag(tenantId, 'client-condominiums')
    await this.cache.set(cacheKey, result, DEFAULT_TTL.LIST)
    await this.cache.addToTag(tag, cacheKey)

    return result
  }
}
