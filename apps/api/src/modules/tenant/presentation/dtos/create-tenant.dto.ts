import { CreateTenantInput } from '@repo/api'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator'

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
  @IsString()
  @IsOptional()
  plan?: string | null
}
