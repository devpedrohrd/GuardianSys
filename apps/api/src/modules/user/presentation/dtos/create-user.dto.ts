import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CreateUserInput } from '@repo/api'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'

const ROLES = ['INVESTIGATOR', 'ADMIN', 'BILLING_AGENT'] as const

export class CreateUserDto implements CreateUserInput {
  @ApiProperty({ description: 'Identificador único do tenant' })
  @IsString()
  @IsOptional()
  tenantId!: string

  @ApiProperty({ description: 'Identificador único do usuário que criou' })
  @IsString()
  @IsOptional()
  createdById!: string

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
  roles?: (typeof ROLES)[number]

  @ApiPropertyOptional({
    description: 'Pode visualizar dados de outros usuários',
  })
  @IsBoolean()
  @IsOptional()
  canViewOthers?: boolean

  @ApiPropertyOptional({ description: 'Pode editar dados de outros usuários' })
  @IsBoolean()
  @IsOptional()
  canEditOthers?: boolean

  @ApiPropertyOptional({ description: 'Pode deletar dados de outros usuários' })
  @IsBoolean()
  @IsOptional()
  canDeleteOthers?: boolean

  @ApiPropertyOptional({ description: 'Pode deletar os próprios dados' })
  @IsBoolean()
  @IsOptional()
  canDeleteOwn?: boolean
}
