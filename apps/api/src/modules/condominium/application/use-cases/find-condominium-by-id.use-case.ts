import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import {
  ICondominiumRepository,
  CONDOMINIUM_REPOSITORY,
} from '../../domain/repositories/condominium.repository.interface'
import { Condominium } from '@repo/api'
import { CondominiumNotFoundException } from '../../domain/exceptions/condominium.exception'
import {
  ICacheService,
  CACHE_SERVICE,
  CacheKeyBuilder,
  DEFAULT_TTL,
} from '../../../../common/cache'

@Injectable()
export class FindCondominiumByIdUseCase {
  constructor(
    @Inject(CONDOMINIUM_REPOSITORY)
    private readonly condominiumRepository: ICondominiumRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(id: string, tenantId: string): Promise<Condominium> {
    const cacheKey = CacheKeyBuilder.forEntity(tenantId, 'condominium', id)
    const cached = await this.cache.get<Condominium>(cacheKey)
    if (cached) return cached

    const condominium = await this.condominiumRepository.findById(id)
    if (!condominium) {
      throw new CondominiumNotFoundException(id)
    }

    const tag = CacheKeyBuilder.forTag(tenantId, 'condominiums')
    await this.cache.set(cacheKey, condominium, DEFAULT_TTL.ENTITY)
    await this.cache.addToTag(tag, cacheKey)

    return condominium
  }
}
