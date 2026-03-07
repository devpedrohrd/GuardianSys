import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../../../../config/database/Prisma.service'
import { RegisterDto } from '../../presentation/dtos'
import {
  TenantSlugAlreadyExistsException,
  EmailAlreadyExistsException,
} from '../../domain/exceptions'
import { JwtPayload } from '../../../../common/interfaces'

export interface RegisterResult {
  tenant: {
    id: string
    name: string
    slug: string
  }
  user: {
    id: string
    name: string
    email: string
    roles: string
  }
  accessToken: string
  refreshToken: string
}

@Injectable()
export class RegisterUseCase {
  private readonly logger = new Logger(RegisterUseCase.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: RegisterDto): Promise<RegisterResult> {
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug: input.slug },
    })

    if (existingTenant) {
      throw new TenantSlugAlreadyExistsException(input.slug)
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { email: input.adminEmail.toLowerCase() },
    })

    if (existingUser) {
      throw new EmailAlreadyExistsException(input.adminEmail)
    }

    const hashedPassword = await bcrypt.hash(input.adminPassword, 10)

    const result = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: input.companyName,
          slug: input.slug.toLowerCase(),
          customDomain: input.customDomain ?? null,
          email: input.companyEmail ?? null,
          phone: input.companyPhone ?? null,
          document: input.document ?? null,
          address: input.address ?? null,
        },
      })

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: input.adminName,
          email: input.adminEmail.toLowerCase(),
          password: hashedPassword,
          roles: 'ADMIN',
          canViewOthers: true,
          canEditOthers: true,
          canDeleteOthers: true,
          canDeleteOwn: true,
        },
      })

      return { tenant, user }
    })

    const payload: JwtPayload = {
      sub: result.user.id,
      tenantId: result.tenant.id,
      roles: result.user.roles,
    }

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
    })
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    })

    this.logger.log(
      `Novo tenant registrado: ${result.tenant.name} (${result.tenant.slug})`,
    )

    return {
      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
        slug: result.tenant.slug,
      },
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        roles: result.user.roles,
      },
      accessToken,
      refreshToken,
    }
  }
}
