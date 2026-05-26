import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsUUID,
} from 'class-validator'
import { CreateCondominiumInput } from '@repo/api'

export class CreateCondominiumDto implements CreateCondominiumInput {
  @ApiProperty({ description: 'ID of the tenant' })
  @IsUUID()
  @IsOptional()
  tenantId!: string

  @ApiProperty({ description: 'Name of the condominium' })
  @IsString()
  @IsNotEmpty()
  name!: string

  @ApiProperty({ description: 'Name of the manager' })
  @IsString()
  @IsNotEmpty()
  manager!: string

  @ApiPropertyOptional({ description: 'Contact of the manager' })
  @IsString()
  @IsOptional()
  managerContact!: string

  @ApiPropertyOptional({ description: 'Contact of the concierge' })
  @IsString()
  @IsOptional()
  conciergeContact!: string

  @ApiPropertyOptional({ description: 'Address of the condominium' })
  @IsString()
  @IsOptional()
  address!: string

  @ApiPropertyOptional({ description: 'Opening date of the condominium' })
  @IsDateString()
  @IsOptional()
  openingDate!: Date

  @ApiPropertyOptional({ description: 'ID of the user who created it' })
  @IsString()
  @IsOptional()
  createdBy!: string
}
