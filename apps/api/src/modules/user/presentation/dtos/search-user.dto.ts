import type { Role, SearchUserFilter } from '@repo/api'
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { ROLES } from './create-user.dto'

export class SearchUserDto implements SearchUserFilter {
  @IsEnum(ROLES)
  @IsOptional()
  role?: Role

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  canManageProducts?: boolean

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  canCreateCharges?: boolean

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  canExportData?: boolean

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  canReopenCases?: boolean

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  canViewOthers?: boolean

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  canEditOthers?: boolean

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  skip?: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number

  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  id?: string
}
