import { Module } from '@nestjs/common'
import { PrismaModule } from '../../config/database/Prisma.module'
import { TENANT_REPOSITORY } from './domain/repositories'
import { PrismaTenantRepository } from './infrastructure/repositories'
import {
  CreateTenantUseCase,
  FindTenantByIdUseCase,
  FindAllTenantsUseCase,
  UpdateTenantUseCase,
  DeleteTenantUseCase,
} from './application/use-cases'
import { TenantController } from './presentation/controllers'

@Module({
  imports: [PrismaModule],
  controllers: [TenantController],
  providers: [
    // Repository — injeta a implementação concreta para o token do domain
    {
      provide: TENANT_REPOSITORY,
      useClass: PrismaTenantRepository,
    },
    // Use Cases
    CreateTenantUseCase,
    FindTenantByIdUseCase,
    FindAllTenantsUseCase,
    UpdateTenantUseCase,
    DeleteTenantUseCase,
  ],
})
export class TenantModule {}
