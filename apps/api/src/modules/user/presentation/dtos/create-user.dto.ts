import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'
import { SearchUsersFilter } from '../../domain/repositories'

const ROLES = ['INVESTIGATOR', 'ADMIN', 'BILLING_AGENT'] as const

export class CreateUserDto {
  @ApiProperty({ description: 'Identificador único do usuário (uid)' })
  @IsString()
  @IsNotEmpty()
  uid!: string

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
