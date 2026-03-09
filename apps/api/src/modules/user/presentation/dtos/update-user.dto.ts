import { ApiPropertyOptional } from '@nestjs/swagger'
import { Role, UpdateUserInput } from '@repo/api'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'
import { ROLES } from './create-user.dto'

export class UpdateUserDto implements UpdateUserInput {
  @ApiPropertyOptional({ description: 'Nome do usuário' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ description: 'E-mail do usuário' })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({ description: 'Senha do usuário' })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string

  @ApiPropertyOptional({ description: 'Role do usuário' })
  @IsEnum(ROLES)
  @IsOptional()
  role?: Role

  @ApiPropertyOptional({ description: 'Pode gerenciar produtos' })
  @IsBoolean()
  @IsOptional()
  canManageProducts?: boolean

  @ApiPropertyOptional({ description: 'Pode criar cobranças' })
  @IsBoolean()
  @IsOptional()
  canCreateCharges?: boolean

  @ApiPropertyOptional({ description: 'Pode exportar dados' })
  @IsBoolean()
  @IsOptional()
  canExportData?: boolean

  @ApiPropertyOptional({ description: 'Pode reabrir casos' })
  @IsBoolean()
  @IsOptional()
  canReopenCases?: boolean

  @ApiPropertyOptional({ description: 'Pode visualizar dados de outros usuários' })
  @IsBoolean()
  @IsOptional()
  canViewOthers?: boolean

  @ApiPropertyOptional({ description: 'Pode editar dados de outros usuários' })
  @IsBoolean()
  @IsOptional()
  canEditOthers?: boolean

  @ApiPropertyOptional({ description: 'Identificador único do usuário que criou' })
  @IsString()
  @IsOptional()
  createdById?: string
}
