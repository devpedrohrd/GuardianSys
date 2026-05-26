import { Module } from '@nestjs/common'
import { CondominiumController } from './presentation/controllers'
import {
  CreateCondominiumUseCase,
  UpdateCondominiumUseCase,
  DeleteCondominiumUseCase,
  FindCondominiumByIdUseCase,
  FindAllCondominiumsUseCase,
} from './application/use-cases'
import { CONDOMINIUM_REPOSITORY } from './domain/repositories/condominium.repository.interface'
import { PrismaCondominiumRepository } from './infrastructure/repositories'
import { TenantModule } from '../tenant/tenant.module'
import { PrismaModule } from '../../config/database/Prisma.module'

@Module({
  imports: [TenantModule, PrismaModule],
  controllers: [CondominiumController],
  providers: [
    {
      provide: CONDOMINIUM_REPOSITORY,
      useClass: PrismaCondominiumRepository,
    },
    CreateCondominiumUseCase,
    UpdateCondominiumUseCase,
    DeleteCondominiumUseCase,
    FindCondominiumByIdUseCase,
    FindAllCondominiumsUseCase,
  ],
})
export class CondominiumModule {}
