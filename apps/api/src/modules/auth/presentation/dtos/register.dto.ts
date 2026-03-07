import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'

export class RegisterDto {
  @ApiProperty({ description: 'Nome da empresa' })
  @IsString()
  @IsNotEmpty()
  companyName!: string

  @ApiProperty({ description: 'Slug único da empresa (URL-friendly)' })
  @IsString()
  @IsNotEmpty()
  slug!: string

  @ApiProperty({ description: 'Nome do administrador' })
  @IsString()
  @IsNotEmpty()
  adminName!: string

  @ApiProperty({ description: 'E-mail do administrador' })
  @IsEmail()
  @IsNotEmpty()
  adminEmail!: string

  @ApiProperty({ description: 'Senha do administrador (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6)
  adminPassword!: string

  @ApiPropertyOptional({ description: 'Domínio customizado' })
  @IsString()
  @IsOptional()
  customDomain?: string

  @ApiPropertyOptional({ description: 'E-mail da empresa' })
  @IsEmail()
  @IsOptional()
  companyEmail?: string

  @ApiPropertyOptional({ description: 'Telefone da empresa' })
  @IsString()
  @IsOptional()
  companyPhone?: string

  @ApiPropertyOptional({ description: 'Documento da empresa (CNPJ)' })
  @IsString()
  @IsOptional()
  document?: string

  @ApiPropertyOptional({ description: 'Endereço da empresa' })
  @IsString()
  @IsOptional()
  address?: string
}
