import { Inject, Injectable } from '@nestjs/common'
import { BankAccountEntity } from '../../domain/entities'
import { IBankAccountRepository, BANK_ACCOUNT_REPOSITORY } from '../../domain/repositories'
import { BankAccountNotFoundException } from '../../domain/exceptions'
import { ICacheService, CACHE_SERVICE, CacheKeyBuilder, DEFAULT_TTL } from '../../../../common/cache'

@Injectable()
export class FindBankAccountByIdUseCase {
  constructor(
    @Inject(BANK_ACCOUNT_REPOSITORY)
    private readonly bankAccountRepository: IBankAccountRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(tenantId: string, id: string): Promise<BankAccountEntity> {
    const cacheKey = CacheKeyBuilder.forEntity(tenantId, 'bank-account', id)
    const cached = await this.cache.get<BankAccountEntity>(cacheKey)
    if (cached) return cached

    const bankAccount = await this.bankAccountRepository.findById(tenantId, id)
    if (!bankAccount) {
      throw new BankAccountNotFoundException(id)
    }

    const tag = CacheKeyBuilder.forTag(tenantId, 'bank-accounts')
    await this.cache.set(cacheKey, bankAccount, DEFAULT_TTL.ENTITY)
    await this.cache.addToTag(tag, cacheKey)

    return bankAccount
  }
}
