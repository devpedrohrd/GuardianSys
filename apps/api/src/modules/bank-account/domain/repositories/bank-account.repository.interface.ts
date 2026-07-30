import { BankAccountEntity } from '../entities/BankAccount'
import {
  CreateBankAccountInput,
  UpdateBankAccountInput,
  SearchBankAccountFilter,
  PaginatedResponse,
} from '@repo/api'

export interface IBankAccountRepository {
  findById(tenantId: string, id: string): Promise<BankAccountEntity | null>
  findByName(tenantId: string, name: string): Promise<BankAccountEntity | null>
  findAll(
    tenantId: string,
    filter: SearchBankAccountFilter,
  ): Promise<PaginatedResponse<BankAccountEntity>>
  create(input: CreateBankAccountInput): Promise<BankAccountEntity>
  update(
    tenantId: string,
    id: string,
    input: UpdateBankAccountInput,
  ): Promise<BankAccountEntity>
  softDelete(tenantId: string, id: string): Promise<void>
}

export const BANK_ACCOUNT_REPOSITORY = Symbol('IBankAccountRepository')
