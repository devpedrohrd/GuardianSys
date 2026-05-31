import { Inject, Injectable } from '@nestjs/common'
import { CreateClientInput } from '@repo/api'
import { ClientEntity } from '../../domain/entities'
import { IClientRepository, CLIENT_REPOSITORY } from '../../domain/repositories'

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(input: CreateClientInput): Promise<ClientEntity> {
    return this.clientRepository.create(input)
  }
}
