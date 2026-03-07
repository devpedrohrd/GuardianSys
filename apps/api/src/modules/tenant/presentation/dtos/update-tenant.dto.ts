import { UpdateTenantInput } from '@repo/api'
import { IsOptional, IsString } from 'class-validator'

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

  @IsOptional()
  @IsString()
  plan?: string | null
}
