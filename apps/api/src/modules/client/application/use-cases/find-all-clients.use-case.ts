import { Inject, Injectable } from '@nestjs/common'
import { PaginatedResponse, SearchClientFilter } from '@repo/api'
import { ClientEntity } from '../../domain/entities'
import { IClientRepository, CLIENT_REPOSITORY } from '../../domain/repositories'

@Injectable()
export class FindAllClientsUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(
    tenantId: string,
    filter: SearchClientFilter,
  ): Promise<PaginatedResponse<ClientEntity>> {
    return this.clientRepository.findAll(tenantId, filter)
  }
}
