import { Inject, Injectable } from '@nestjs/common'
import { SearchBankAccountFilter, PaginatedResponse } from '@repo/api'
import { BankAccountEntity } from '../../domain/entities'
import { IBankAccountRepository, BANK_ACCOUNT_REPOSITORY } from '../../domain/repositories'
import { ICacheService, CACHE_SERVICE, CacheKeyBuilder, DEFAULT_TTL } from '../../../../common/cache'

@Injectable()
export class FindAllBankAccountsUseCase {
  constructor(
    @Inject(BANK_ACCOUNT_REPOSITORY)
    private readonly bankAccountRepository: IBankAccountRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(
    tenantId: string,
    filter: SearchBankAccountFilter,
  ): Promise<PaginatedResponse<BankAccountEntity>> {
    const cacheKey = CacheKeyBuilder.forList(tenantId, 'bank-accounts', filter as unknown as Record<string, unknown>)
    const cached = await this.cache.get<PaginatedResponse<BankAccountEntity>>(cacheKey)
    if (cached) return cached

    const result = await this.bankAccountRepository.findAll(tenantId, filter)

    const tag = CacheKeyBuilder.forTag(tenantId, 'bank-accounts')
    await this.cache.set(cacheKey, result, DEFAULT_TTL.LIST)
    await this.cache.addToTag(tag, cacheKey)

    return result
  }
}
