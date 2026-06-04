import {
  Controller,
  Post,
  Get,
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
  AddClientToCondominiumUseCase,
  RemoveClientFromCondominiumUseCase,
  FindCondominiumsByClientUseCase,
  FindClientsByCondominiumUseCase,
} from '../../application/use-cases'
import { CreateClientCondominiumDto, SearchClientCondominiumDto } from '../dtos'
import { ClientExceptionFilter } from '../filters'
import {
  JwtAuthGuard,
  TenantGuard,
  RolesGuard,
} from '../../../../common/guards'
import { Roles, CurrentUser } from '../../../../common/decorators'
import { AuthenticatedUser } from '../../../../common/interfaces'

@ApiTags('Client Condominiums')
@ApiBearerAuth('access-token')
@Controller('client-condominiums')
@UseGuards(JwtAuthGuard, TenantGuard)
@UseFilters(ClientExceptionFilter)
export class ClientCondominiumController {
  constructor(
    private readonly addClientToCondominium: AddClientToCondominiumUseCase,
    private readonly removeClientFromCondominium: RemoveClientFromCondominiumUseCase,
    private readonly findCondominiumsByClient: FindCondominiumsByClientUseCase,
    private readonly findClientsByCondominium: FindClientsByCondominiumUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles('ADMIN','INVESTIGATOR')
  @ApiOperation({ summary: 'Vincular cliente a um condomínio (apenas ADMIN)' })
  @ApiBody({ type: CreateClientCondominiumDto })
  @ApiResponse({ status: 201, description: 'Vínculo criado com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente ou condomínio não encontrado' })
  @ApiResponse({ status: 409, description: 'Vínculo já existe' })
  async create(
    @Body() dto: CreateClientCondominiumDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.addClientToCondominium.execute(user.tenantId as string, dto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'INVESTIGATOR')
  @ApiOperation({ summary: 'Listar vínculos cliente-condomínio (filtro por clientId ou condominiumId)' })
  @ApiResponse({ status: 200, description: 'Vínculos encontrados' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() dto: SearchClientCondominiumDto,
  ) {
    const tenantId = user.tenantId as string

    if (dto.clientId) {
      return this.findCondominiumsByClient.execute(tenantId, dto.clientId, dto)
    }

    if (dto.condominiumId) {
      return this.findClientsByCondominium.execute(tenantId, dto.condominiumId, dto)
    }

    return { data: [], total: 0, page: 1, limit: dto.limit ?? 10 }
  }

  @Delete(':clientId/:condominiumId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles('ADMIN','INVESTIGATOR')
  @ApiOperation({ summary: 'Remover vínculo cliente-condomínio (apenas ADMIN e INVESTIGATOR)' })
  @ApiResponse({ status: 204, description: 'Vínculo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  async remove(
    @Param('clientId') clientId: string,
    @Param('condominiumId') condominiumId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.removeClientFromCondominium.execute(user.tenantId as string, {
      clientId,
      condominiumId,
    })
  }
}
