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
  CreateUserUseCase,
  FindUserByIdUseCase,
  FindAllUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '../../application/use-cases'
import { CreateUserDto, UpdateUserDto } from '../dtos'
import { UserExceptionFilter } from '../filters'
import {
  JwtAuthGuard,
  RolesGuard,
  TenantGuard,
} from '../../../../common/guards'
import { CurrentUser, Roles } from '../../../../common/decorators'
import { AuthenticatedUser } from '../../../../common/interfaces'
import { SearchUserDto } from '../dtos/search-user.dto'

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, TenantGuard)
@UseFilters(UserExceptionFilter)
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findUserById: FindUserByIdUseCase,
    private readonly findAllUsers: FindAllUsersUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar novo usuário (apenas ADMIN)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.createUser.execute({
      tenantId: user.tenantId,
      createdById: user.userId,
      uid: dto.uid,
      name: dto.name,
      email: dto.email,
      password: dto.password,
      roles: dto.roles,
      canViewOthers: dto.canViewOthers,
      canEditOthers: dto.canEditOthers,
      canDeleteOthers: dto.canDeleteOthers,
      canDeleteOwn: dto.canDeleteOwn,
    })
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar usuários do tenant' })
  @ApiResponse({ status: 200, description: 'Usuários encontrados' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAll(
    @CurrentUser('tenantId') tenantId: string,
    @Query() dto: SearchUserDto,
  ) {
    return this.findAllUsers.execute(tenantId, dto)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findById(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.findUserById.execute(tenantId, id)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async update(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.updateUser.execute(tenantId, id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover usuário (apenas ADMIN)' })
  @ApiResponse({ status: 204, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async remove(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
  ) {
    await this.deleteUser.execute(tenantId, id)
  }
}
