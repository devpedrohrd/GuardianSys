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
  CreateClientUseCase,
  FindClientByIdUseCase,
  FindAllClientsUseCase,
  UpdateClientUseCase,
  DeleteClientUseCase,
} from '../../application/use-cases'
import { CreateClientDto, UpdateClientDto, SearchClientDto } from '../dtos'
import { ClientExceptionFilter } from '../filters'
import {
  JwtAuthGuard,
  TenantGuard,
  RolesGuard,
} from '../../../../common/guards'
import { Roles, CurrentUser } from '../../../../common/decorators'
import { AuthenticatedUser } from '../../../../common/interfaces'

@ApiTags('Clients')
@ApiBearerAuth('access-token')
@Controller('clients')
@UseGuards(JwtAuthGuard, TenantGuard)
@UseFilters(ClientExceptionFilter)
export class ClientController {
  constructor(
    private readonly createClient: CreateClientUseCase,
    private readonly findClientById: FindClientByIdUseCase,
    private readonly findAllClients: FindAllClientsUseCase,
    private readonly updateClient: UpdateClientUseCase,
    private readonly deleteClient: DeleteClientUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'INVESTIGATOR')
  @ApiOperation({ summary: 'Criar novo cliente (apenas ADMIN e INVESTIGATOR)' })
  @ApiBody({ type: CreateClientDto })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  async create(
    @Body() dto: CreateClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.createClient.execute({
      ...dto,
      tenantId: user.tenantId as string,
      createdById: user.userId,
    })
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'INVESTIGATOR')
  @ApiOperation({ summary: 'Listar clientes do tenant' })
  @ApiResponse({ status: 200, description: 'Clientes encontrados' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() dto: SearchClientDto,
  ) {
    return this.findAllClients.execute(user.tenantId as string, dto)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'INVESTIGATOR')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.findClientById.execute(user.tenantId as string, id)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'INVESTIGATOR')
  @ApiOperation({ summary: 'Atualizar cliente (apenas ADMIN e INVESTIGATOR)' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.updateClient.execute(user.tenantId as string, id, {
      ...dto,
      updatedById: user.userId,
    })
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'INVESTIGATOR')
  @ApiOperation({
    summary: 'Remover cliente - soft delete (apenas ADMIN e INVESTIGATOR)',
  })
  @ApiResponse({ status: 204, description: 'Cliente removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.deleteClient.execute(user.tenantId as string, id)
  }
}
