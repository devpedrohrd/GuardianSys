import { Inject, Injectable } from '@nestjs/common'
import { UpdateClientInput } from '@repo/api'
import { ClientEntity } from '../../domain/entities'
import { IClientRepository, CLIENT_REPOSITORY } from '../../domain/repositories'
import { ClientNotFoundException } from '../../domain/exceptions'

@Injectable()
export class UpdateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(
    tenantId: string,
    id: string,
    input: UpdateClientInput,
  ): Promise<ClientEntity> {
    const client = await this.clientRepository.findById(tenantId, id)

    if (!client) {
      throw new ClientNotFoundException(id)
    }

    return this.clientRepository.update(tenantId, id, input)
  }
}
