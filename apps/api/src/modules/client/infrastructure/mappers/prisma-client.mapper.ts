import { Client as PrismaClient } from '@prisma/client'
import { ClientEntity } from '../../domain/entities/Client'

export class PrismaClientMapper {
  static toDomain(raw: PrismaClient): ClientEntity {
    return ClientEntity.restore({
      id: raw.id,
      tenantId: raw.tenantId,
      name: raw.name,
      email: raw.email ?? null,
      phone: raw.phone ?? null,
      document: raw.document ?? null,
      address: raw.address ?? null,
      complement: raw.complement ?? null,
      observation: raw.observation ?? null,
      dateOfBirth: raw.dateOfBirth ?? null,
      createdById: raw.createdById ?? null,
      updatedById: raw.updatedById ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt ?? null,
    })
  }
}
