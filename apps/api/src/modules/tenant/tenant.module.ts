import { Module } from '@nestjs/common'
import { PrismaModule } from '../../config/database/Prisma.module'
import { AuthModule } from '../auth/auth.module'
import { TENANT_REPOSITORY } from './domain/repositories'
import { PrismaTenantRepository } from './infrastructure/repositories'
import {
  FindTenantByIdUseCase,
} from './application/use-cases'
import { TenantController } from './presentation/controllers'

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TenantController],
  providers: [
    {
      provide: TENANT_REPOSITORY,
      useClass: PrismaTenantRepository,
    },
    FindTenantByIdUseCase,
  ],
})
export class TenantModule {}

