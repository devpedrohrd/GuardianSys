import { Inject, Injectable } from '@nestjs/common'
import { UpdateBankAccountInput } from '@repo/api'
import { BankAccountEntity } from '../../domain/entities'
import { IBankAccountRepository, BANK_ACCOUNT_REPOSITORY } from '../../domain/repositories'
import { BankAccountNotFoundException } from '../../domain/exceptions'
import { ICacheService, CACHE_SERVICE, CacheKeyBuilder } from '../../../../common/cache'

@Injectable()
export class UpdateBankAccountUseCase {
  constructor(
    @Inject(BANK_ACCOUNT_REPOSITORY)
    private readonly bankAccountRepository: IBankAccountRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(
    tenantId: string,
    id: string,
    input: UpdateBankAccountInput,
  ): Promise<BankAccountEntity> {
    const bankAccount = await this.bankAccountRepository.findById(tenantId, id)
    if (!bankAccount) {
      throw new BankAccountNotFoundException(id)
    }

    const result = await this.bankAccountRepository.update(tenantId, id, input)

    const entityKey = CacheKeyBuilder.forEntity(tenantId, 'bank-account', id)
    const tag = CacheKeyBuilder.forTag(tenantId, 'bank-accounts')
    await this.cache.del(entityKey)
    await this.cache.invalidateByTag(tag)

    return result
  }
}
