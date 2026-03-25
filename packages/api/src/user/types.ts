import type { Role } from '../common/types.js'

export interface User {
  id: string
  tenantId: string | null
  name: string
  email: string
  password: string
  role: Role
  createdById: string | null
  canManageProducts: boolean
  canCreateCharges: boolean
  canExportData: boolean
  canReopenCases: boolean
  canViewOthers: boolean
  canEditOthers: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInput {
  tenantId: string | null
  name: string
  email: string
  password: string
  role: Role
  createdById: string | null
  canManageProducts: boolean
  canCreateCharges: boolean
  canExportData: boolean
  canReopenCases: boolean
  canViewOthers: boolean
  canEditOthers: boolean
}

export interface SearchUserFilter {
  skip?: number
  limit?: number
  name?: string
  email?: string
  role?: Role
  canManageProducts?: boolean
  canCreateCharges?: boolean
  canExportData?: boolean
  canReopenCases?: boolean
  canViewOthers?: boolean
  canEditOthers?: boolean
  id?: string
}

export interface UpdateUserInput
  extends Partial<Omit<CreateUserInput, 'tenantId'>> {}
