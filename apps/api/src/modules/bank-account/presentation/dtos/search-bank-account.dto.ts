import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class SearchBankAccountDto {
  @ApiPropertyOptional({ description: 'Filtrar por nome' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ description: 'Filtrar por código do banco' })
  @IsString()
  @IsOptional()
  bankCode?: string

  @ApiPropertyOptional({ description: 'Registros para pular' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  skip?: number

  @ApiPropertyOptional({ description: 'Limite de registros' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number
}
