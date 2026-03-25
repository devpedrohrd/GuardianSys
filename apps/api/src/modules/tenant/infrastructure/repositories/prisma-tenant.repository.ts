import { Injectable } from '@nestjs/common'
import {
  CreateTenantInput,
  UpdateTenantInput,
  Plan,
  SubscriptionStatus,
} from '@repo/api'
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

    return TenantEntity.restore({
      ...tenant,
      plan: tenant.plan as Plan | null,
      subscriptionStatus: tenant.subscriptionStatus as SubscriptionStatus,
    })
  }

  async findBySlug(slug: string): Promise<TenantEntity | null> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    })

    if (!tenant) return null

    return TenantEntity.restore({
      ...tenant,
      plan: tenant.plan as Plan | null,
      subscriptionStatus: tenant.subscriptionStatus as SubscriptionStatus,
    })
  }

  async create(input: CreateTenantInput): Promise<TenantEntity> {
    const tenant = await this.prisma.tenant.create({
      data: {
        ...input,
        plan: input.plan as Plan,
        subscriptionStatus: input.subscriptionStatus as any,
      },
    })

    return TenantEntity.restore({
      ...tenant,
      plan: tenant.plan as Plan | null,
      subscriptionStatus: tenant.subscriptionStatus as SubscriptionStatus,
    })
  }

  async update(id: string, input: UpdateTenantInput): Promise<TenantEntity> {
    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: {
        ...input,
        subscriptionStatus: input.subscriptionStatus ?? undefined,
        plan: input.plan as any,
      },
    })

    return TenantEntity.restore({
      ...tenant,
      plan: tenant.plan as Plan | null,
      subscriptionStatus: tenant.subscriptionStatus as SubscriptionStatus,
    })
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
      tenants: tenants.map((t) =>
        TenantEntity.restore({
          ...t,
          plan: t.plan as Plan | null,
          subscriptionStatus: t.subscriptionStatus as SubscriptionStatus,
        }),
      ),
      total,
    }
  }
}
