import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

export class CreateBankAccountDto {
  @ApiProperty({ description: 'Nome da conta bancária', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string

  @ApiPropertyOptional({ description: 'Código do banco', maxLength: 10 })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  bankCode?: string

  @ApiPropertyOptional({ description: 'Agência', maxLength: 20 })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  agency?: string

  @ApiPropertyOptional({ description: 'Dígito da agência', maxLength: 5 })
  @IsString()
  @IsOptional()
  @MaxLength(5)
  agencyDigit?: string

  @ApiPropertyOptional({ description: 'Número da conta', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  accountNumber?: string

  @ApiPropertyOptional({ description: 'Dígito da conta', maxLength: 5 })
  @IsString()
  @IsOptional()
  @MaxLength(5)
  accountDigit?: string

  @ApiPropertyOptional({ description: 'Chave PIX', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  pixKey?: string
}
