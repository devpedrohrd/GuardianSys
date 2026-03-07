import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { PrismaModule } from '../../config/database/Prisma.module'
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy'
import { RegisterUseCase, LoginUseCase } from './application/use-cases'
import { AuthController } from './presentation/controllers'

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret',
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRES_IN_SECONDS) || 86400,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, RegisterUseCase, LoginUseCase],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
