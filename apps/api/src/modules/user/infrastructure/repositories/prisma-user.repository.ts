import { Injectable } from '@nestjs/common'
import { CreateUserInput, UpdateUserInput } from '@repo/api'
import { PrismaService } from '../../../../config/database/Prisma.service'
import { UserEntity } from '../../domain/entities'
import {
  IUserRepository,
  SearchUsersFilter,
  PaginatedUsers,
} from '../../domain/repositories'

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(tenantId: string, id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
    })

    if (!user) return null

    return UserEntity.restore(user)
  }

  async findByEmail(
    tenantId: string,
    email: string,
  ): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase(), tenantId },
    })

    if (!user) return null

    return UserEntity.restore(user)
  }

  async findAll(
    tenantId: string,
    filter: SearchUsersFilter,
  ): Promise<PaginatedUsers> {
    const { skip = 0, limit = 10, name, email } = filter

    const where: Record<string, unknown> = { tenantId }

    if (name) {
      where.name = { contains: name, mode: 'insensitive' }
    }

    if (email) {
      where.email = { contains: email, mode: 'insensitive' }
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ])

    return {
      users: users.map((u) => UserEntity.restore(u)),
      total,
    }
  }

  async create(input: CreateUserInput): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
        email: input.email.toLowerCase(),
        password: input.password,
        roles: input.roles ?? 'INVESTIGATOR',
        createdById: input.createdById ?? undefined,
        canViewOthers: input.canViewOthers ?? false,
        canEditOthers: input.canEditOthers ?? false,
        canDeleteOthers: input.canDeleteOthers ?? false,
        canDeleteOwn: input.canDeleteOwn ?? true,
      },
    })

    return UserEntity.restore(user)
  }

  async update(
    tenantId: string,
    id: string,
    input: UpdateUserInput,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id, tenantId },
      data: input,
    })

    return UserEntity.restore(user)
  }

  async delete(tenantId: string, id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id, tenantId },
    })
  }
}
