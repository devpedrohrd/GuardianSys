import { Inject, Injectable } from '@nestjs/common'
import { CreateBankAccountInput } from '@repo/api'
import { BankAccountEntity } from '../../domain/entities'
import { IBankAccountRepository, BANK_ACCOUNT_REPOSITORY } from '../../domain/repositories'
import { BankAccountAlreadyExistsException } from '../../domain/exceptions'
import { ICacheService, CACHE_SERVICE, CacheKeyBuilder } from '../../../../common/cache'

@Injectable()
export class CreateBankAccountUseCase {
  constructor(
    @Inject(BANK_ACCOUNT_REPOSITORY)
    private readonly bankAccountRepository: IBankAccountRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(input: CreateBankAccountInput): Promise<BankAccountEntity> {
    const existing = await this.bankAccountRepository.findByName(
      input.tenantId,
      input.name,
    )
    if (existing) {
      throw new BankAccountAlreadyExistsException(input.name)
    }

    const bankAccount = await this.bankAccountRepository.create(input)

    const tag = CacheKeyBuilder.forTag(input.tenantId, 'bank-accounts')
    await this.cache.invalidateByTag(tag)

    return bankAccount
  }
}
