import { Role } from '@prisma/client'
import type { SearchUserFilter } from '@repo/api'
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class SearchUserDto implements SearchUserFilter {
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

  @ApiPropertyOptional({ enum: Role })
  @IsEnum(Role)
  @IsOptional()
  roles?: Role

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  canViewOthers?: boolean

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  canEditOthers?: boolean

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  canDeleteOthers?: boolean

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  canDeleteOwn?: boolean

  @IsString()
  @IsOptional()
  id?: string
}
