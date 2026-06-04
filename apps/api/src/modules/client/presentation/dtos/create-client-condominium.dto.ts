import { ApiProperty } from '@nestjs/swagger'
import { IsUUID, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator'

export class CreateClientCondominiumDto {
  @ApiProperty({ description: 'ID do cliente' })
  @IsUUID()
  @IsNotEmpty()
  clientId!: string

  @ApiProperty({ description: 'IDs dos condomínios', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  condominiumIds!: string[]
}
