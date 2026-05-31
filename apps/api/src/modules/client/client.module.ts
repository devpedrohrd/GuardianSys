import { Module } from '@nestjs/common'
import { ClientController } from './presentation/controllers'
import {
  CreateClientUseCase,
  FindClientByIdUseCase,
  FindAllClientsUseCase,
  UpdateClientUseCase,
  DeleteClientUseCase,
} from './application/use-cases'
import { CLIENT_REPOSITORY } from './domain/repositories'
import { PrismaClientRepository } from './infrastructure/repositories'
import { PrismaModule } from '../../config/database/Prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [ClientController],
  providers: [
    {
      provide: CLIENT_REPOSITORY,
      useClass: PrismaClientRepository,
    },
    CreateClientUseCase,
    FindClientByIdUseCase,
    FindAllClientsUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
  ],
})
export class ClientModule {}
