import { Module } from '@nestjs/common'
import { PrismaModule } from '../../config/database/Prisma.module'
import { AuthModule } from '../auth/auth.module'
import { USER_REPOSITORY } from './domain/repositories'
import { PrismaUserRepository } from './infrastructure/repositories'
import {
  CreateUserUseCase,
  FindUserByIdUseCase,
  FindAllUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from './application/use-cases'
import { UserController } from './presentation/controllers'

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    CreateUserUseCase,
    FindUserByIdUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UserModule {}
