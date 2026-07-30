import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../config/database/Prisma.service'
import { PaginatedResponse } from '@repo/api'
import { ICondominiumRepository } from '../../domain/repositories/condominium.repository.interface'
import { CondominiumEntity } from '../../domain/entities/Condominium'
import { PrismaCondominiumMapper } from '../mappers/prisma-condominium.mapper'
import { buildSearchFilters, buildUpdateFilters } from '../filters'
import { SearchCondominiumDto } from '../../presentation/dtos/search-condominium.dto'
import {
  CreateCondominiumDto,
  UpdateCondominiumDto,
} from '../../presentation/dtos'

@Injectable()
export class PrismaCondominiumRepository implements ICondominiumRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<CondominiumEntity | null> {
    const condominium = await this.prisma.condominium.findFirst({
      where: { id, deletedAt: null },
    })

    if (!condominium) {
      return null
    }

    return PrismaCondominiumMapper.toDomain(condominium)
  }

  async create(input: CreateCondominiumDto): Promise<CondominiumEntity> {
    const { createdBy, ...rest } = input

    const condominium = await this.prisma.condominium.create({
      data: {
        ...rest,
        createdById: createdBy,
      },
    })

    await this.prisma.userCondominium.create({
      data: {
        userId: input.createdBy,
        condominiumId: condominium.id,
      },
    })

    return PrismaCondominiumMapper.toDomain(condominium)
  }

  async update(
    id: string,
    input: UpdateCondominiumDto,
    tenantId: string,
  ): Promise<CondominiumEntity> {
    const data = buildUpdateFilters(input)

    const condominium = await this.prisma.condominium.update({
      where: { id, tenantId },
      data,
    })

    return PrismaCondominiumMapper.toDomain(condominium)
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.prisma.condominium.updateMany({
      where: { id, tenantId, deletedAt: null },
      data: { deletedAt: new Date() },
    })
  }

  async findAll(
    filter: SearchCondominiumDto,
  ): Promise<PaginatedResponse<CondominiumEntity>> {
    const { skip = 0, limit = 10, where } = buildSearchFilters(filter)

    const [total, condominiums] = await Promise.all([
      this.prisma.condominium.count({ where }),
      this.prisma.condominium.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return {
      total,
      data: condominiums.map(PrismaCondominiumMapper.toDomain),
      limit,
      page: Math.floor(skip / limit) + 1,
    }
  }
}
