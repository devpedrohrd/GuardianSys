import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../../../../config/database/Prisma.service'
import { LoginDto } from '../../presentation/dtos'
import {
  InvalidCredentialsException,
  InactiveTenantException,
} from '../../domain/exceptions'
import { JwtPayload } from '../../../../common/interfaces'

export interface LoginResult {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginDto): Promise<LoginResult> {
    const user = await this.prisma.user.findFirst({
      where: { email: input.email.toLowerCase() },
      include: { tenant: true },
    })

    if (!user) {
      throw new InvalidCredentialsException()
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password)

    if (!isPasswordValid) {
      throw new InvalidCredentialsException()
    }

    if (!user.tenant.isActive) {
      throw new InactiveTenantException()
    }

    const payload: JwtPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      roles: user.roles,
    }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
      secret: process.env.JWT_SECRET,
    })
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
      secret: process.env.JWT_REFRESH_SECRET,
    })

    return {
      accessToken,
      refreshToken,
    }
  }
}
