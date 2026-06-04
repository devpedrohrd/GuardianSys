import { Module } from '@nestjs/common'
import { ClientController, ClientCondominiumController } from './presentation/controllers'
import {
  CreateClientUseCase,
  FindClientByIdUseCase,
  FindAllClientsUseCase,
  UpdateClientUseCase,
  DeleteClientUseCase,
  AddClientToCondominiumUseCase,
  RemoveClientFromCondominiumUseCase,
  FindCondominiumsByClientUseCase,
  FindClientsByCondominiumUseCase,
} from './application/use-cases'
import { CLIENT_REPOSITORY } from './domain/repositories'
import { PrismaClientRepository } from './infrastructure/repositories'
import { PrismaModule } from '../../config/database/Prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [ClientController, ClientCondominiumController],
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
    AddClientToCondominiumUseCase,
    RemoveClientFromCondominiumUseCase,
    FindCondominiumsByClientUseCase,
    FindClientsByCondominiumUseCase,
  ],
})
export class ClientModule {}
