import { Injectable, Inject } from '@nestjs/common'
import {
  ICondominiumRepository,
  CONDOMINIUM_REPOSITORY,
} from '../../domain/repositories/condominium.repository.interface'
import { SearchCondominiumDto } from '../../presentation/dtos/search-condominium.dto'
import { PaginatedResponse } from '@repo/api'
import { CondominiumEntity } from '../../domain/entities/Condominium'
import {
  ICacheService,
  CACHE_SERVICE,
  CacheKeyBuilder,
  DEFAULT_TTL,
} from '../../../../common/cache'

@Injectable()
export class FindAllCondominiumsUseCase {
  constructor(
    @Inject(CONDOMINIUM_REPOSITORY)
    private readonly condominiumRepository: ICondominiumRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(
    filter: SearchCondominiumDto,
  ): Promise<PaginatedResponse<CondominiumEntity>> {
    const tenantId = filter.tenantId as string
    const cacheKey = CacheKeyBuilder.forList(tenantId, 'condominiums', filter as unknown as Record<string, unknown>)
    const cached = await this.cache.get<PaginatedResponse<CondominiumEntity>>(cacheKey)
    if (cached) return cached

    const result = await this.condominiumRepository.findAll(filter)

    const tag = CacheKeyBuilder.forTag(tenantId, 'condominiums')
    await this.cache.set(cacheKey, result, DEFAULT_TTL.LIST)
    await this.cache.addToTag(tag, cacheKey)

    return result
  }
}
