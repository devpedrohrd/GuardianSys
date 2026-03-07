import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'

const ROLES = ['INVESTIGATOR', 'ADMIN', 'BILLING_AGENT'] as const

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Nome do usuário' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ description: 'E-mail do usuário' })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({ description: 'Nova senha (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string

  @ApiPropertyOptional({
    description: 'Role do usuário',
    enum: ROLES,
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
