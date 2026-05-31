import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class SearchClientDto {
  @ApiPropertyOptional({ description: 'Nome do cliente' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ description: 'E-mail do cliente' })
  @IsString()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({ description: 'Documento (CPF) do cliente' })
  @IsString()
  @IsOptional()
  document?: string

  @ApiPropertyOptional({ description: 'Quantidade de registros a pular' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  skip?: number

  @ApiPropertyOptional({ description: 'Limite de registros por página' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number
}
