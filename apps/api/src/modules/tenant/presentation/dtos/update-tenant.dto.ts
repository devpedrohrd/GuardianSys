import { ApiProperty } from '@nestjs/swagger'
import type { UpdateTenantInput } from '@repo/api'
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator'
import { Plan, SubscriptionStatus } from '../../../../common/enums'

export class UpdateTenantDto implements UpdateTenantInput {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  slug?: string

  @IsOptional()
  @IsString()
  customDomain?: string | null

  @IsOptional()
  @IsString()
  logoUrl?: string | null

  @IsOptional()
  @IsString()
  faviconUrl?: string | null

  @IsOptional()
  @IsString()
  primaryColor?: string | null

  @IsOptional()
  @IsString()
  secondaryColor?: string | null

  @IsOptional()
  @IsString()
  displayName?: string | null

  @IsOptional()
  @IsString()
  document?: string | null

  @IsOptional()
  @IsString()
  email?: string | null

  @IsOptional()
  @IsString()
  phone?: string | null

  @IsOptional()
  @IsString()
  address?: string | null

  @ApiProperty({ enum: Plan, enumName: 'Plan', required: false, nullable: true })
  @IsOptional()
  @IsEnum(Plan)
  plan?: Plan | null

  @ApiProperty({ enum: SubscriptionStatus, enumName: 'SubscriptionStatus', required: false })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  subscriptionStatus?: SubscriptionStatus

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
