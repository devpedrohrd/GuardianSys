import { CreateTenantInput, UpdateTenantInput } from '@repo/api'
import { TenantEntity } from '../entities'

export interface SearchTenantsFilter {
  skip?: number
  limit?: number
  name?: string
  isActive?: boolean
}

export interface PaginatedTenants {
  total: number
  tenants: TenantEntity[]
}

export interface ITenantRepository {
  findById(id: string): Promise<TenantEntity | null>
  findBySlug(slug: string): Promise<TenantEntity | null>
  create(input: CreateTenantInput): Promise<TenantEntity>
  update(id: string, input: UpdateTenantInput): Promise<TenantEntity>
  delete(id: string): Promise<void>
  findAll(filter: SearchTenantsFilter): Promise<PaginatedTenants>
}

export const TENANT_REPOSITORY = Symbol('ITenantRepository')
