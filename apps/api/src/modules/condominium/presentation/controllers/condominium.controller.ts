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
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  CreateCondominiumUseCase,
  UpdateCondominiumUseCase,
  FindCondominiumByIdUseCase,
  FindAllCondominiumsUseCase,
  DeleteCondominiumUseCase,
} from '../../application/use-cases'
import { CreateCondominiumDto, UpdateCondominiumDto } from '../dtos'
import {
  JwtAuthGuard,
  TenantGuard,
  RolesGuard,
} from '../../../../common/guards'
import { Roles, CurrentUser } from '../../../../common/decorators'
import { AuthenticatedUser } from '../../../../common/interfaces'
import { SearchCondominiumDto } from '../dtos/search-condominium.dto'

@ApiTags('Condominiums')
@ApiBearerAuth('access-token')
@Controller('condominiums')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class CondominiumController {
  constructor(
    private readonly createCondominium: CreateCondominiumUseCase,
    private readonly updateCondominium: UpdateCondominiumUseCase,
    private readonly findCondominiumById: FindCondominiumByIdUseCase,
    private readonly findAllCondominiums: FindAllCondominiumsUseCase,
    private readonly deleteCondominium: DeleteCondominiumUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Cria um novo condomínio' })
  @ApiResponse({ status: 201, description: 'Condomínio criado com sucesso' })
  async create(
    @Body() input: CreateCondominiumDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (user.role === 'ADMIN' && user.tenantId) {
      input.tenantId = user.tenantId
    }
    if (!input.createdBy) {
      input.createdBy = user.userId
    }
    return this.createCondominium.execute(input)
  }

  @Get()
  @Roles('ADMIN', 'INVESTIGATOR')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lista os condomínios' })
  @ApiResponse({ status: 200, description: 'Condomínios listados com sucesso' })
  async findAll(
    @Query() filter: SearchCondominiumDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (user.role === 'ADMIN' && user.tenantId) {
      filter.tenantId = user.tenantId
    }
    return this.findAllCondominiums.execute(filter)
  }

  @Get(':id')
  @Roles('ADMIN', 'INVESTIGATOR')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Busca um condomínio pelo id' })
  @ApiResponse({
    status: 200,
    description: 'Condomínio encontrado com sucesso',
  })
  async findById(@Param('id') id: string) {
    return this.findCondominiumById.execute(id)
  }

  @Patch(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualiza um condomínio' })
  @ApiResponse({
    status: 200,
    description: 'Condomínio atualizado com sucesso',
  })
  async update(
    @Param('id') id: string,
    @Body() input: UpdateCondominiumDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.updateCondominium.execute(id, input, user)
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleta um condomínio' })
  @ApiResponse({ status: 204, description: 'Condomínio deletado com sucesso' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.deleteCondominium.execute(id, user)
  }
}
