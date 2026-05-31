import { Inject, Injectable } from '@nestjs/common'
import { IClientRepository, CLIENT_REPOSITORY } from '../../domain/repositories'
import { ClientNotFoundException } from '../../domain/exceptions'

@Injectable()
export class DeleteClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(tenantId: string, id: string): Promise<void> {
    const client = await this.clientRepository.findById(tenantId, id)

    if (!client) {
      throw new ClientNotFoundException(id)
    }

    await this.clientRepository.softDelete(tenantId, id)
  }
}
