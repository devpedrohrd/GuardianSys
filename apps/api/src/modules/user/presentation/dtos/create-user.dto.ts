import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CreateUserInput, Role } from '@repo/api'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'

export const ROLES = ['INVESTIGATOR', 'ADMIN'] as const

export class CreateUserDto implements CreateUserInput {
  @ApiProperty({ description: 'Identificador único do tenant' })
  @IsString()
  @IsOptional()
  tenantId!: string

  @ApiProperty({ description: 'Nome do usuário' })
  @IsString()
  @IsNotEmpty()
  name!: string

  @ApiProperty({ description: 'E-mail do usuário' })
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @ApiProperty({ description: 'Senha (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6)
  password!: string

  @ApiPropertyOptional({
    description: 'Role do usuário',
    enum: ROLES,
    default: 'INVESTIGATOR',
  })
  @IsEnum(ROLES)
  @IsOptional()
  role!: Role

  @ApiProperty({ description: 'Identificador único do usuário que criou' })
  @IsString()
  @IsOptional()
  createdById!: string

  @ApiProperty({ description: 'Pode gerenciar produtos' })
  @IsBoolean()
  @IsOptional()
  canManageProducts!: boolean

  @ApiProperty({ description: 'Pode criar cobranças' })
  @IsBoolean()
  @IsOptional()
  canCreateCharges!: boolean

  @ApiProperty({ description: 'Pode exportar dados' })
  @IsBoolean()
  @IsOptional()
  canExportData!: boolean

  @ApiProperty({ description: 'Pode reabrir casos' })
  @IsBoolean()
  @IsOptional()
  canReopenCases!: boolean

  @ApiProperty({ description: 'Pode visualizar dados de outros usuários' })
  @IsBoolean()
  @IsOptional()
  canViewOthers!: boolean

  @ApiProperty({ description: 'Pode editar dados de outros usuários' })
  @IsBoolean()
  @IsOptional()
  canEditOthers!: boolean
}
