import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  JwtAuthGuard,
  BackofficeGuard,
  RolesGuard,
} from '../../../../common/guards'
import { Roles } from '../../../../common/decorators'
import {
  CreateTenantUseCase,
  FindTenantByIdUseCase,
  FindAllTenantsUseCase,
  UpdateTenantUseCase,
} from '../../../tenant/application/use-cases'
import { CreateTenantAdminUseCase } from '../../application/use-cases'
import { CreateTenantDto, UpdateTenantDto } from '../../../tenant/presentation/dtos'
import { CreateTenantAdminDto } from '../dtos'
import { DomainExceptionFilter } from '../../../tenant/presentation/filters'
import { UserExceptionFilter } from '../../../user/presentation/filters'

@ApiTags('Backoffice')
@ApiBearerAuth('access-token')
@Controller('backoffice/tenants')
@UseGuards(JwtAuthGuard, BackofficeGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class BackofficeController {
  constructor(
    private readonly createTenant: CreateTenantUseCase,
    private readonly findTenantById: FindTenantByIdUseCase,
    private readonly findAllTenants: FindAllTenantsUseCase,
    private readonly updateTenant: UpdateTenantUseCase,
    private readonly createTenantAdmin: CreateTenantAdminUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseFilters(DomainExceptionFilter)
  @ApiOperation({ summary: 'Criar novo tenant (SUPER_ADMIN)' })
  @ApiBody({ type: CreateTenantDto })
  @ApiResponse({ status: 201, description: 'Tenant criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 409, description: 'Slug já existente' })
  async create(@Body() dto: CreateTenantDto) {
    return this.createTenant.execute(dto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos os tenants (SUPER_ADMIN)' })
  @ApiResponse({ status: 200, description: 'Tenants listados com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiQuery({ name: 'skip', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: String, description: "'true' ou 'false'" })
  async findAll(
    @Query('skip') skip?: string,
    @Query('limit') limit?: string,
    @Query('name') name?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.findAllTenants.execute({
      skip: skip ? parseInt(skip, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      name,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    })
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseFilters(DomainExceptionFilter)
  @ApiOperation({ summary: 'Buscar tenant por ID (SUPER_ADMIN)' })
  @ApiResponse({ status: 200, description: 'Tenant encontrado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Tenant não encontrado' })
  async findById(@Param('id') id: string) {
    return this.findTenantById.execute(id)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseFilters(DomainExceptionFilter)
  @ApiOperation({
    summary: 'Atualizar tenant (SUPER_ADMIN) — plano, status, isActive, etc.',
  })
  @ApiBody({ type: UpdateTenantDto })
  @ApiResponse({ status: 200, description: 'Tenant atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Tenant não encontrado' })
  async update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.updateTenant.execute(id, dto)
  }

  @Post(':id/create-admin')
  @HttpCode(HttpStatus.CREATED)
  @UseFilters(UserExceptionFilter, DomainExceptionFilter)
  @ApiOperation({
    summary: 'Criar primeiro ADMIN de um tenant (SUPER_ADMIN)',
  })
  @ApiBody({ type: CreateTenantAdminDto })
  @ApiResponse({
    status: 201,
    description: 'Administrador do tenant criado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Tenant não encontrado' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  async createAdmin(
    @Param('id') tenantId: string,
    @Body() dto: CreateTenantAdminDto,
  ) {
    return this.createTenantAdmin.execute(tenantId, dto)
  }
}
