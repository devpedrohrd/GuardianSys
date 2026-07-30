import { Module } from '@nestjs/common'
import { BankAccountController } from './presentation/controllers'
import {
  CreateBankAccountUseCase,
  FindBankAccountByIdUseCase,
  FindAllBankAccountsUseCase,
  UpdateBankAccountUseCase,
  DeleteBankAccountUseCase,
} from './application/use-cases'
import { BANK_ACCOUNT_REPOSITORY } from './domain/repositories'
import { PrismaBankAccountRepository } from './infrastructure/repositories'
import { PrismaModule } from '../../config/database/Prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [BankAccountController],
  providers: [
    {
      provide: BANK_ACCOUNT_REPOSITORY,
      useClass: PrismaBankAccountRepository,
    },
    CreateBankAccountUseCase,
    FindBankAccountByIdUseCase,
    FindAllBankAccountsUseCase,
    UpdateBankAccountUseCase,
    DeleteBankAccountUseCase,
  ],
})
export class BankAccountModule {}
