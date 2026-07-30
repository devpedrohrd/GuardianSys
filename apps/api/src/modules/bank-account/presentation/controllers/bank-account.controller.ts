import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseFilters,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  CreateBankAccountUseCase,
  FindBankAccountByIdUseCase,
  FindAllBankAccountsUseCase,
  UpdateBankAccountUseCase,
  DeleteBankAccountUseCase,
} from '../../application/use-cases'
import { CreateBankAccountDto, UpdateBankAccountDto, SearchBankAccountDto } from '../dtos'
import { BankAccountExceptionFilter } from '../filters'
import {
  JwtAuthGuard,
  TenantGuard,
  RolesGuard,
} from '../../../../common/guards'
import { Roles, CurrentUser } from '../../../../common/decorators'
import { AuthenticatedUser } from '../../../../common/interfaces'

@ApiTags('Bank Accounts')
@ApiBearerAuth('access-token')
@Controller('bank-accounts')
@UseGuards(JwtAuthGuard, TenantGuard)
@UseFilters(BankAccountExceptionFilter)
export class BankAccountController {
  constructor(
    private readonly createBankAccount: CreateBankAccountUseCase,
    private readonly findBankAccountById: FindBankAccountByIdUseCase,
    private readonly findAllBankAccounts: FindAllBankAccountsUseCase,
    private readonly updateBankAccount: UpdateBankAccountUseCase,
    private readonly deleteBankAccount: DeleteBankAccountUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'INVESTIGATOR')
  @ApiOperation({ summary: 'Criar nova conta bancária' })
  @ApiBody({ type: CreateBankAccountDto })
  @ApiResponse({ status: 201, description: 'Conta bancária criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 409, description: 'Conta com este nome já existe' })
  async create(
    @Body() dto: CreateBankAccountDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.createBankAccount.execute({
      ...dto,
      tenantId: user.tenantId as string,
      createdById: user.userId,
    })
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'INVESTIGATOR')
  @ApiOperation({ summary: 'Listar contas bancárias do tenant' })
  @ApiResponse({ status: 200, description: 'Contas bancárias encontradas' })
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() dto: SearchBankAccountDto,
  ) {
    return this.findAllBankAccounts.execute(user.tenantId as string, dto)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'INVESTIGATOR')
  @ApiOperation({ summary: 'Buscar conta bancária por ID' })
  @ApiResponse({ status: 200, description: 'Conta bancária encontrada' })
  @ApiResponse({ status: 404, description: 'Conta bancária não encontrada' })
  async findById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.findBankAccountById.execute(user.tenantId as string, id)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'INVESTIGATOR')
  @ApiOperation({ summary: 'Atualizar conta bancária' })
  @ApiBody({ type: UpdateBankAccountDto })
  @ApiResponse({ status: 200, description: 'Conta bancária atualizada' })
  @ApiResponse({ status: 404, description: 'Conta bancária não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBankAccountDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.updateBankAccount.execute(user.tenantId as string, id, {
      ...dto,
      updatedById: user.userId,
    })
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'INVESTIGATOR')
  @ApiOperation({ summary: 'Remover conta bancária (soft delete)' })
  @ApiResponse({ status: 204, description: 'Conta bancária removida' })
  @ApiResponse({ status: 404, description: 'Conta bancária não encontrada' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.deleteBankAccount.execute(user.tenantId as string, id)
  }
}
