import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import {
  ICondominiumRepository,
  CONDOMINIUM_REPOSITORY,
} from '../../domain/repositories/condominium.repository.interface'
import { CreateCondominiumInput, Condominium } from '@repo/api'
import { CondominiumEntity } from '../../domain/entities/Condominium'
import {
  ITenantRepository,
  TENANT_REPOSITORY,
} from '../../../tenant/domain/repositories/tenant.repository.interface'
import { CondominiumHasNoTenantException } from '../../domain/exceptions/condominium.exception'
import { ICacheService, CACHE_SERVICE, CacheKeyBuilder } from '../../../../common/cache'

@Injectable()
export class CreateCondominiumUseCase {
  constructor(
    @Inject(CONDOMINIUM_REPOSITORY)
    private readonly condominiumRepository: ICondominiumRepository,
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(input: CreateCondominiumInput): Promise<Condominium> {
    const tenant = await this.tenantRepository.findById(input.tenantId)

    if (!tenant) {
      throw new CondominiumHasNoTenantException(input.tenantId)
    }

    const condominium = await this.condominiumRepository.create(input)

    const tag = CacheKeyBuilder.forTag(input.tenantId, 'condominiums')
    await this.cache.invalidateByTag(tag)

    return condominium
  }
}
