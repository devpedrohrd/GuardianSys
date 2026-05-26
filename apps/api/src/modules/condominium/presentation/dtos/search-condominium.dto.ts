import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { SearchCondominiumInput } from '@repo/api'
import { Type } from 'class-transformer'

export class SearchCondominiumDto implements SearchCondominiumInput {
  @ApiPropertyOptional({ description: 'Name of the condominium' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ description: 'Manager of the condominium' })
  @IsString()
  @IsOptional()
  manager?: string

  @ApiPropertyOptional({ description: 'Contact of the manager' })
  @IsString()
  @IsOptional()
  managerContact?: string

  @ApiPropertyOptional({ description: 'Contact of the concierge' })
  @IsString()
  @IsOptional()
  conciergeContact?: string

  @ApiPropertyOptional({ description: 'ID of the condominium' })
  @IsString()
  @IsOptional()
  id?: string

  @ApiPropertyOptional({ description: 'ID of the tenant' })
  @IsString()
  @IsOptional()
  tenantId?: string

  @ApiPropertyOptional({ description: 'Limit of the search' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number

  @ApiPropertyOptional({ description: 'Skip of the search' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  skip?: number

  @ApiPropertyOptional({ description: 'Address of the condominium' })
  @IsString()
  @IsOptional()
  address?: string
}
