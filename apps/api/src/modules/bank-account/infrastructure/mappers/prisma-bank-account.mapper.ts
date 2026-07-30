import { BankAccount as PrismaBankAccount } from '@prisma/client'
import { BankAccountEntity } from '../../domain/entities/BankAccount'

export class PrismaBankAccountMapper {
  static toDomain(raw: PrismaBankAccount): BankAccountEntity {
    return BankAccountEntity.restore({
      id: raw.id,
      tenantId: raw.tenantId,
      name: raw.name,
      bankCode: raw.bankCode ?? null,
      agency: raw.agency ?? null,
      agencyDigit: raw.agencyDigit ?? null,
      accountNumber: raw.accountNumber ?? null,
      accountDigit: raw.accountDigit ?? null,
      pixKey: raw.pixKey ?? null,
      createdById: raw.createdById ?? null,
      updatedById: raw.updatedById ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt ?? null,
    })
  }
}
