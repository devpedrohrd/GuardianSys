import { Injectable } from '@nestjs/common'
import { CreateTenantInput, UpdateTenantInput } from '@repo/api'
import { PrismaService } from '../../../../config/database/Prisma.service'
import { TenantEntity } from '../../domain/entities'
import {
  ITenantRepository,
  SearchTenantsFilter,
  PaginatedTenants,
} from '../../domain/repositories'

@Injectable()
export class PrismaTenantRepository implements ITenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<TenantEntity | null> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
    })

    if (!tenant) return null

    return TenantEntity.restore(tenant)
  }

  async findBySlug(slug: string): Promise<TenantEntity | null> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    })

    if (!tenant) return null

    return TenantEntity.restore(tenant)
  }

  async create(input: CreateTenantInput): Promise<TenantEntity> {
    const tenant = await this.prisma.tenant.create({
      data: {
        name: input.name,
        slug: input.slug,
        customDomain: input.customDomain ?? null,
        logoUrl: input.logoUrl ?? null,
        faviconUrl: input.faviconUrl ?? null,
        primaryColor: input.primaryColor ?? null,
        secondaryColor: input.secondaryColor ?? null,
        displayName: input.displayName ?? null,
        document: input.document ?? null,
        email: input.email ?? null,
        phone: input.phone ?? null,
        address: input.address ?? null,
        plan: input.plan ?? null,
      },
    })

    return TenantEntity.restore(tenant)
  }

  async update(id: string, input: UpdateTenantInput): Promise<TenantEntity> {
    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: input,
    })

    return TenantEntity.restore(tenant)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tenant.delete({
      where: { id },
    })
  }

  async findAll(filter: SearchTenantsFilter): Promise<PaginatedTenants> {
    const { skip = 0, limit = 10, name, isActive } = filter

    const where: Record<string, unknown> = {}

    if (name) {
      where.name = { contains: name, mode: 'insensitive' }
    }

    if (isActive !== undefined) {
      where.isActive = isActive
    }

    const [tenants, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tenant.count({ where }),
    ])

    return {
      tenants: tenants.map((t) => TenantEntity.restore(t)),
      total,
    }
  }
}
