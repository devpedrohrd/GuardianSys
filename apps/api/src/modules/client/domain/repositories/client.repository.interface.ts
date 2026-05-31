import { ClientEntity } from '../entities/Client'
import {
  CreateClientInput,
  UpdateClientInput,
  SearchClientFilter,
  PaginatedResponse,
} from '@repo/api'

export interface IClientRepository {
  findById(tenantId: string, id: string): Promise<ClientEntity | null>
  findAll(
    tenantId: string,
    filter: SearchClientFilter,
  ): Promise<PaginatedResponse<ClientEntity>>
  create(input: CreateClientInput): Promise<ClientEntity>
  update(
    tenantId: string,
    id: string,
    input: UpdateClientInput,
  ): Promise<ClientEntity>
  softDelete(tenantId: string, id: string): Promise<void>
}

export const CLIENT_REPOSITORY = Symbol('IClientRepository')
