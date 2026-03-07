import { Role } from '@prisma/client'
import type { SearchUserFilter } from '@repo/api'
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class SearchUserDto implements SearchUserFilter {
  @IsNumber()
  @IsOptional()
  skip?: number

  @IsNumber()
  @IsOptional()
  limit?: number

  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  email?: string

  @IsEnum(Role)
  @IsOptional()
  roles?: Role

  @IsBoolean()
  @IsOptional()
  canViewOthers?: boolean

  @IsBoolean()
  @IsOptional()
  canEditOthers?: boolean

  @IsBoolean()
  @IsOptional()
  canDeleteOthers?: boolean

  @IsBoolean()
  @IsOptional()
  canDeleteOwn?: boolean
}
