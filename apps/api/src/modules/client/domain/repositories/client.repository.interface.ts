import { ClientEntity } from '../entities/Client'
import {
  CreateClientInput,
  UpdateClientInput,
  SearchClientFilter,
  SearchClientCondominiumFilter,
  PaginatedResponse,
  ClientCondominium,
} from '@repo/api'

export interface IClientRepository {
  findById(tenantId: string, id: string): Promise<ClientEntity | null>
  findByName(tenantId: string, name: string): Promise<ClientEntity | null>
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

  // ClientCondominium methods
  relateClientToCondominium(clientId: string, condominiumId: string): Promise<void>
  removeClientFromCondominium(clientId: string, condominiumId: string): Promise<void>
  findClientCondominium(clientId: string, condominiumId: string): Promise<ClientCondominium | null>
  findCondominiumsByClientId(
    tenantId: string,
    clientId: string,
    filter: SearchClientCondominiumFilter,
  ): Promise<PaginatedResponse<ClientCondominium>>
  findClientsByCondominiumId(
    tenantId: string,
    condominiumId: string,
    filter: SearchClientCondominiumFilter,
  ): Promise<PaginatedResponse<ClientCondominium>>
  condominiumExists(tenantId: string, condominiumId: string): Promise<boolean>
}

export const CLIENT_REPOSITORY = Symbol('IClientRepository')
