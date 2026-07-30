import { BankAccount, CreateBankAccountInput } from '@repo/api'

export class BankAccountEntity implements BankAccount {
  readonly id: string
  readonly tenantId: string
  readonly name: string
  readonly bankCode: string | null
  readonly agency: string | null
  readonly agencyDigit: string | null
  readonly accountNumber: string | null
  readonly accountDigit: string | null
  readonly pixKey: string | null
  readonly createdById: string | null
  readonly updatedById: string | null
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly deletedAt: Date | null

  private constructor(props: BankAccount) {
    this.id = props.id
    this.tenantId = props.tenantId
    this.name = props.name
    this.bankCode = props.bankCode
    this.agency = props.agency
    this.agencyDigit = props.agencyDigit
    this.accountNumber = props.accountNumber
    this.accountDigit = props.accountDigit
    this.pixKey = props.pixKey
    this.createdById = props.createdById
    this.updatedById = props.updatedById
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
    this.deletedAt = props.deletedAt
  }

  static create(input: CreateBankAccountInput): BankAccountEntity {
    const now = new Date()

    return new BankAccountEntity({
      id: '',
      tenantId: input.tenantId,
      name: input.name,
      bankCode: input.bankCode ?? null,
      agency: input.agency ?? null,
      agencyDigit: input.agencyDigit ?? null,
      accountNumber: input.accountNumber ?? null,
      accountDigit: input.accountDigit ?? null,
      pixKey: input.pixKey ?? null,
      createdById: input.createdById ?? null,
      updatedById: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    })
  }

  static restore(data: BankAccount): BankAccountEntity {
    return new BankAccountEntity(data)
  }
}
