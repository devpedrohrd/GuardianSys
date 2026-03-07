import type { Role } from '../common/types.js'

export interface User {
  id: string
  tenantId: string
  uid: string
  name: string
  email: string
  password: string
  roles: Role
  createdById: string | null
  canViewOthers: boolean
  canEditOthers: boolean
  canDeleteOthers: boolean
  canDeleteOwn: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInput {
  tenantId: string
  uid: string
  name: string
  email: string
  password: string
  roles?: Role
  createdById?: string | null
  canViewOthers?: boolean
  canEditOthers?: boolean
  canDeleteOthers?: boolean
  canDeleteOwn?: boolean
}

export interface SearchUserFilter {
  skip?: number
  limit?: number
  name?: string
  email?: string
  roles?: Role
  canViewOthers?: boolean
  canEditOthers?: boolean
  canDeleteOthers?: boolean
  canDeleteOwn?: boolean
}

export interface UpdateUserInput
  extends Partial<Omit<CreateUserInput, 'tenantId' | 'uid'>> {}
