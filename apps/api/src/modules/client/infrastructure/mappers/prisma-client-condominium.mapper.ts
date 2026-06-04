import { ClientCondominium as PrismaClientCondominium, Client as PrismaClient, Condominium as PrismaCondominium } from '@prisma/client'
import { ClientCondominium } from '@repo/api'

type PrismaClientCondominiumWithRelations = PrismaClientCondominium & {
  client?: PrismaClient
  condominium?: PrismaCondominium
}

export class PrismaClientCondominiumMapper {
  static toDomain(raw: PrismaClientCondominiumWithRelations): ClientCondominium {
    const result: ClientCondominium = {
      clientId: raw.clientId,
      condominiumId: raw.condominiumId,
      createdAt: raw.createdAt,
    }

    if (raw.client) {
      result.client = {
        id: raw.client.id,
        tenantId: raw.client.tenantId,
        name: raw.client.name,
        email: raw.client.email ?? null,
        phone: raw.client.phone ?? null,
        document: raw.client.document ?? null,
        address: raw.client.address ?? null,
        complement: raw.client.complement ?? null,
        observation: raw.client.observation ?? null,
        dateOfBirth: raw.client.dateOfBirth ?? null,
        createdById: raw.client.createdById ?? null,
        updatedById: raw.client.updatedById ?? null,
        createdAt: raw.client.createdAt,
        updatedAt: raw.client.updatedAt,
        deletedAt: raw.client.deletedAt ?? null,
      }
    }

    if (raw.condominium) {
      result.condominium = {
        id: raw.condominium.id,
        tenantId: raw.condominium.tenantId,
        name: raw.condominium.name,
        manager: raw.condominium.manager,
        managerContact: raw.condominium.managerContact ?? '',
        conciergeContact: raw.condominium.conciergeContact ?? '',
        address: raw.condominium.address ?? '',
        openingDate: raw.condominium.openingDate ?? new Date(),
        createdBy: raw.condominium.createdById ?? '',
        createdAt: raw.condominium.createdAt,
        updatedAt: raw.condominium.updatedAt,
        deletedAt: raw.condominium.deletedAt ?? null,
      }
    }

    return result
  }
}
