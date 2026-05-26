import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsDateString } from 'class-validator'
import { UpdateCondominiumInput } from '@repo/api'

export class UpdateCondominiumDto implements UpdateCondominiumInput {
  @ApiPropertyOptional({ description: 'Tenant ID' })
  @IsString()
  @IsOptional()
  tenantId?: string

  @ApiPropertyOptional({ description: 'Name of the condominium' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ description: 'Name of the manager' })
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

  @ApiPropertyOptional({ description: 'Address of the condominium' })
  @IsString()
  @IsOptional()
  address?: string

  @ApiPropertyOptional({ description: 'Opening date of the condominium' })
  @IsDateString()
  @IsOptional()
  openingDate?: Date
}
