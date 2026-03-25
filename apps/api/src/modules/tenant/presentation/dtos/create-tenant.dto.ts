import { ApiProperty } from '@nestjs/swagger'
import type { CreateTenantInput } from '@repo/api'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { Plan } from '../../../../common/enums'
import { IsCPF } from '../../../../common/decorators/CPF.decorator'

export class CreateTenantDto implements CreateTenantInput {
  @IsString()
  @IsNotEmpty()
  name!: string
  @IsString()
  @IsNotEmpty()
  slug!: string
  @IsString()
  @IsOptional()
  customDomain?: string | null
  @IsString()
  @IsOptional()
  logoUrl?: string | null
  @IsString()
  @IsOptional()
  faviconUrl?: string | null
  @IsString()
  @IsOptional()
  primaryColor?: string | null
  @IsString()
  @IsOptional()
  secondaryColor?: string | null
  @IsString()
  @IsOptional()
  displayName?: string | null
  @IsString()
  @IsOptional()
  @IsCPF()
  document?: string | null
  @IsEmail()
  @IsOptional()
  email?: string | null
  @IsString()
  @IsOptional()
  phone?: string | null
  @IsString()
  @IsOptional()
  address?: string | null
  @ApiProperty({
    enum: Plan,
    enumName: 'Plan',
    required: false,
    nullable: true,
  })
  @IsEnum(Plan)
  @IsOptional()
  plan?: Plan | null
}
