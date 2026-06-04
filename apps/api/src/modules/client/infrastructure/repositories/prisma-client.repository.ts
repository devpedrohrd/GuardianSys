import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../config/database/Prisma.service'
import {
  CreateClientInput,
  UpdateClientInput,
  SearchClientFilter,
  SearchClientCondominiumFilter,
  PaginatedResponse,
  ClientCondominium,
} from '@repo/api'
import { IClientRepository } from '../../domain/repositories'
import { ClientEntity } from '../../domain/entities'
import { PrismaClientMapper } from '../mappers/prisma-client.mapper'
import { PrismaClientCondominiumMapper } from '../mappers/prisma-client-condominium.mapper'
import { buildSearchFilters, buildUpdateFilters } from '../filters'

@Injectable()
export class PrismaClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(tenantId: string, name: string): Promise<ClientEntity | null> {
    const client = await this.prisma.client.findFirst({
      where: {
        tenantId,
        name: { equals: name, mode: 'insensitive' },
        deletedAt: null,
      },
    })

    if (!client) return null

    return PrismaClientMapper.toDomain(client)
  }

  async condominiumExists(tenantId: string, condominiumId: string): Promise<boolean> {
    const condominium = await this.prisma.condominium.findFirst({
      where: { id: condominiumId, tenantId, deletedAt: null },
      select: { id: true },
    })
    return !!condominium
  }

  async relateClientToCondominium(clientId: string, condominiumId: string): Promise<void> {
    await this.prisma.clientCondominium.create({
      data: { clientId, condominiumId },
    })
  }

  async removeClientFromCondominium(clientId: string, condominiumId: string): Promise<void> {
    await this.prisma.clientCondominium.delete({
      where: {
        clientId_condominiumId: { clientId, condominiumId },
      },
    })
  }

  async findClientCondominium(clientId: string, condominiumId: string): Promise<ClientCondominium | null> {
    const record = await this.prisma.clientCondominium.findUnique({
      where: {
        clientId_condominiumId: { clientId, condominiumId },
      },
      include: { client: true, condominium: true },
    })

    if (!record) return null

    return PrismaClientCondominiumMapper.toDomain(record)
  }

  async findCondominiumsByClientId(
    tenantId: string,
    clientId: string,
    filter: SearchClientCondominiumFilter,
  ): Promise<PaginatedResponse<ClientCondominium>> {
    const skip = filter.skip ?? 0
    const limit = filter.limit ?? 10

    const where = {
      clientId,
      client: { tenantId, deletedAt: null },
      condominium: { deletedAt: null },
    }

    const [total, records] = await Promise.all([
      this.prisma.clientCondominium.count({ where }),
      this.prisma.clientCondominium.findMany({
        where,
        skip,
        take: limit,
        include: { condominium: true },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return {
      total,
      data: records.map(PrismaClientCondominiumMapper.toDomain),
      limit,
      page: Math.floor(skip / limit) + 1,
    }
  }

  async findClientsByCondominiumId(
    tenantId: string,
    condominiumId: string,
    filter: SearchClientCondominiumFilter,
  ): Promise<PaginatedResponse<ClientCondominium>> {
    const skip = filter.skip ?? 0
    const limit = filter.limit ?? 10

    const where = {
      condominiumId,
      condominium: { tenantId, deletedAt: null },
      client: { deletedAt: null },
    }

    const [total, records] = await Promise.all([
      this.prisma.clientCondominium.count({ where }),
      this.prisma.clientCondominium.findMany({
        where,
        skip,
        take: limit,
        include: { client: true },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return {
      total,
      data: records.map(PrismaClientCondominiumMapper.toDomain),
      limit,
      page: Math.floor(skip / limit) + 1,
    }
  }

  async findById(tenantId: string, id: string): Promise<ClientEntity | null> {
    const client = await this.prisma.client.findFirst({
      where: { id, tenantId, deletedAt: null },
    })

    if (!client) return null

    return PrismaClientMapper.toDomain(client)
  }

  async findAll(
    tenantId: string,
    filter: SearchClientFilter,
  ): Promise<PaginatedResponse<ClientEntity>> {
    const {
      skip = 0,
      limit = 10,
      where,
    } = buildSearchFilters({
      ...filter,
      tenantId,
    })

    const [total, clients] = await Promise.all([
      this.prisma.client.count({ where }),
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return {
      total,
      data: clients.map(PrismaClientMapper.toDomain),
      limit,
      page: Math.floor(skip / limit) + 1,
    }
  }

  async create(input: CreateClientInput): Promise<ClientEntity> {
    const { condominiumIds, ...clientData } = input

    const client = await this.prisma.$transaction(async (tx) => {
      const created = await tx.client.create({
        data: {
          tenantId: clientData.tenantId,
          name: clientData.name,
          email: clientData.email ?? null,
          phone: clientData.phone ?? null,
          document: clientData.document ?? null,
          address: clientData.address ?? null,
          complement: clientData.complement ?? null,
          observation: clientData.observation ?? null,
          dateOfBirth: clientData.dateOfBirth ?? null,
          createdById: clientData.createdById ?? null,
        },
      })

      await tx.clientCondominium.createMany({
        data: condominiumIds.map((condominiumId) => ({
          clientId: created.id,
          condominiumId,
        })),
      })

      return created
    })

    return PrismaClientMapper.toDomain(client)
  }

  async update(
    tenantId: string,
    id: string,
    input: UpdateClientInput,
  ): Promise<ClientEntity> {
    const data = buildUpdateFilters(input)

    const client = await this.prisma.client.update({
      where: { id, tenantId },
      data,
    })

    return PrismaClientMapper.toDomain(client)
  }

  async softDelete(tenantId: string, id: string): Promise<void> {
    await this.prisma.client.update({
      where: { id, tenantId },
      data: { deletedAt: new Date() },
    })
  }
}
