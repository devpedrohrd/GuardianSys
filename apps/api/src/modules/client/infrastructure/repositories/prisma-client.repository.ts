import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../config/database/Prisma.service'
import {
  CreateClientInput,
  UpdateClientInput,
  SearchClientFilter,
  PaginatedResponse,
} from '@repo/api'
import { IClientRepository } from '../../domain/repositories'
import { ClientEntity } from '../../domain/entities'
import { PrismaClientMapper } from '../mappers/prisma-client.mapper'
import { buildSearchFilters, buildUpdateFilters } from '../filters'

@Injectable()
export class PrismaClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaService) {}

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
    const client = await this.prisma.client.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
        email: input.email ?? null,
        phone: input.phone ?? null,
        document: input.document ?? null,
        address: input.address ?? null,
        complement: input.complement ?? null,
        observation: input.observation ?? null,
        dateOfBirth: input.dateOfBirth ?? null,
        createdById: input.createdById ?? null,
      },
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
