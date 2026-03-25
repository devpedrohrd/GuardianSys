import { Module } from '@nestjs/common'
import { PrismaModule } from '../../config/database/Prisma.module'
import { AuthModule } from '../auth/auth.module'
import { CreateTenantAdminUseCase } from './application/use-cases'
import { BackofficeController } from './presentation/controllers'
import { TENANT_REPOSITORY } from '../tenant/domain/repositories'
import { PrismaTenantRepository } from '../tenant/infrastructure/repositories'
import { USER_REPOSITORY } from '../user/domain/repositories'
import { PrismaUserRepository } from '../user/infrastructure/repositories'
import {
  CreateTenantUseCase,
  FindTenantByIdUseCase,
  FindAllTenantsUseCase,
  UpdateTenantUseCase,
} from '../tenant/application/use-cases'

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [BackofficeController],
  providers: [
    // Repositórios
    {
      provide: TENANT_REPOSITORY,
      useClass: PrismaTenantRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    // Use Cases do Tenant reutilizados no Backoffice
    CreateTenantUseCase,
    FindTenantByIdUseCase,
    FindAllTenantsUseCase,
    UpdateTenantUseCase,
    // Use Cases específicos do Backoffice
    CreateTenantAdminUseCase,
  ],
})
export class BackofficeModule {}
