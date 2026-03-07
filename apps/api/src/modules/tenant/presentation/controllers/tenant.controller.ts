import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseFilters,
} from '@nestjs/common'
import {
  CreateTenantUseCase,
  FindTenantByIdUseCase,
  FindAllTenantsUseCase,
  UpdateTenantUseCase,
  DeleteTenantUseCase,
} from '../../application/use-cases'
import { CreateTenantDto, UpdateTenantDto } from '../dtos'
import { DomainExceptionFilter } from '../filters'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('tenants')
@UseFilters(DomainExceptionFilter)
export class TenantController {
  constructor(
    private readonly createTenant: CreateTenantUseCase,
    private readonly findTenantById: FindTenantByIdUseCase,
    private readonly findAllTenants: FindAllTenantsUseCase,
    private readonly updateTenant: UpdateTenantUseCase,
    private readonly deleteTenant: DeleteTenantUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiBody({ type: CreateTenantDto })
  @ApiResponse({
    status: 201,
    description: 'Tenant created successfully',
    type: CreateTenantDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() dto: CreateTenantDto) {
    return this.createTenant.execute(dto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find all tenants' })
  @ApiResponse({
    status: 200,
    description: 'Tenants found successfully',
    type: [CreateTenantDto],
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
  @ApiOperation({ summary: 'Find tenant by id' })
  @ApiResponse({
    status: 200,
    description: 'Tenant found successfully',
    type: CreateTenantDto,
  })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findById(@Param('id') id: string) {
    return this.findTenantById.execute(id)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update tenant' })
  @ApiBody({ type: UpdateTenantDto })
  @ApiResponse({
    status: 200,
    description: 'Tenant updated successfully',
    type: CreateTenantDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.updateTenant.execute(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete tenant' })
  @ApiResponse({ status: 204, description: 'Tenant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('id') id: string) {
    await this.deleteTenant.execute(id)
  }
}
