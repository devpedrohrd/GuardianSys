import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateTenantAdminDto {
  @ApiProperty({ description: 'Nome do administrador' })
  @IsString()
  @IsNotEmpty()
  name!: string

  @ApiProperty({ description: 'E-mail do administrador' })
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @ApiProperty({ description: 'Senha do administrador (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6)
  password!: string
}
