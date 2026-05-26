import { Condominium as PrismaCondominium } from '@prisma/client'
import { CondominiumEntity } from '../../domain/entities/Condominium'

export class PrismaCondominiumMapper {
  static toDomain(raw: PrismaCondominium): CondominiumEntity {
    return CondominiumEntity.restore({
      id: raw.id,
      tenantId: raw.tenantId,
      name: raw.name,
      manager: raw.manager,
      managerContact: raw.managerContact ?? '',
      conciergeContact: raw.conciergeContact ?? '',
      address: raw.address ?? '',
      openingDate: raw.openingDate ?? new Date(),
      createdBy: raw.createdById ?? '',
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    })
  }

  static toPrisma(condominium: CondominiumEntity): Omit<
    PrismaCondominium,
    'createdById' | 'updatedById'
  > & {
    createdById?: string
    updatedById?: string
  } {
    return {
      id: condominium.id,
      tenantId: condominium.tenantId,
      name: condominium.name,
      manager: condominium.manager,
      managerContact: condominium.managerContact,
      conciergeContact: condominium.conciergeContact,
      address: condominium.address,
      openingDate: condominium.openingDate,
      createdById: condominium.createdBy || undefined,
      createdAt: condominium.createdAt,
      updatedAt: condominium.updatedAt,
      deletedAt: condominium.deletedAt ?? null,
    }
  }
}
