import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { JwtService } from '@nestjs/jwt'
import { Request, Response } from 'express'
import { JwtPayload } from '../interfaces/jwt-payload.interface'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const canActivate = await super.canActivate(context)
      return canActivate as boolean
    } catch (err) {
      return this.handleRefreshToken(context)
    }
  }

  private async handleRefreshToken(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    const refreshToken = request.cookies?.refresh_token
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Sua sessão expirou, faça login novamente.',
      )
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
        },
      )

      const newAccessToken = await this.jwtService.signAsync(
        { sub: payload.sub, tenantId: payload.tenantId, role: payload.role },
        {
          secret: process.env.JWT_SECRET || 'fallback-secret',
          expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
        },
      )

      const newRefreshToken = await this.jwtService.signAsync(
        { sub: payload.sub, tenantId: payload.tenantId, role: payload.role },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
          expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
        },
      )

      request.user = {
        userId: payload.sub,
        tenantId: payload.tenantId,
        role: payload.role,
      }

      response.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: process.env.JWT_ACCESS_TOKEN_EXPIRY_TIME as unknown as number,
      })

      response.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: process.env.JWT_REFRESH_TOKEN_EXPIRY_TIME as unknown as number,
      })

      return true
    } catch (err) {
      response.clearCookie('access_token')
      response.clearCookie('refresh_token')
      throw new UnauthorizedException('Sessão expirada, faça login novamente.')
    }
  }
}
