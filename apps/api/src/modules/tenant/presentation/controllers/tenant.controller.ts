import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseFilters,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { FindTenantByIdUseCase } from '../../application/use-cases'
import { DomainExceptionFilter } from '../filters'
import {
  JwtAuthGuard,
  TenantGuard,
  RolesGuard,
} from '../../../../common/guards'
import { CurrentUser, Roles } from '../../../../common/decorators'
import { AuthenticatedUser } from '../../../../common/interfaces'

@ApiTags('Tenants')
@ApiBearerAuth('access-token')
@Controller('tenants')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Roles('ADMIN')
@UseFilters(DomainExceptionFilter)
export class TenantController {
  constructor(
    private readonly findTenantById: FindTenantByIdUseCase,
  ) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ver dados do meu tenant (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Tenant encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Tenant não encontrado' })
  async me(@CurrentUser() user: AuthenticatedUser) {
    return this.findTenantById.execute(user.tenantId as string)
  }
}

