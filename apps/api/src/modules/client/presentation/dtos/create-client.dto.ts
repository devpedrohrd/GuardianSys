import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsDateString,
  IsUUID,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator'
import { IsCPF } from '../../../../common/decorators/CPF.decorator'

export class CreateClientDto {
  @ApiProperty({ description: 'Nome do cliente' })
  @IsString()
  @IsNotEmpty()
  name!: string

  @ApiProperty({ description: 'IDs dos condomínios ao qual o cliente será vinculado', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  condominiumIds!: string[]

  @ApiPropertyOptional({ description: 'E-mail do cliente' })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({ description: 'Telefone do cliente' })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiPropertyOptional({ description: 'CPF do cliente' })
  @IsCPF({ message: 'CPF inválido' })
  @IsOptional()
  document?: string

  @ApiPropertyOptional({ description: 'Endereço do cliente' })
  @IsString()
  @IsOptional()
  address?: string

  @ApiPropertyOptional({ description: 'Complemento do endereço' })
  @IsString()
  @IsOptional()
  complement?: string

  @ApiPropertyOptional({ description: 'Observação sobre o cliente' })
  @IsString()
  @IsOptional()
  observation?: string

  @ApiPropertyOptional({ description: 'Data de nascimento do cliente' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date
}
