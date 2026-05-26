import { CondominiumEntity } from '../entities/Condominium'
import {
  SearchCondominiumInput,
  CreateCondominiumInput,
  UpdateCondominiumInput,
  PaginatedResponse,
} from '@repo/api'

export interface ICondominiumRepository {
  findById(id: string): Promise<CondominiumEntity | null>
  create(input: CreateCondominiumInput): Promise<CondominiumEntity>
  update(
    id: string,
    input: UpdateCondominiumInput,
    tenantId: string,
  ): Promise<CondominiumEntity>
  delete(id: string, tenantId: string): Promise<void>
  findAll(
    filter: SearchCondominiumInput,
  ): Promise<PaginatedResponse<CondominiumEntity>>
}

export const CONDOMINIUM_REPOSITORY = Symbol('ICondominiumRepository')
