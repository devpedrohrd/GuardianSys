import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsUUID, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class SearchClientCondominiumDto {
  @ApiPropertyOptional({ description: 'ID do cliente' })
  @IsUUID()
  @IsOptional()
  clientId?: string

  @ApiPropertyOptional({ description: 'ID do condomínio' })
  @IsUUID()
  @IsOptional()
  condominiumId?: string

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
