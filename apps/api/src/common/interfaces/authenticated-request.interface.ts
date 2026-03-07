import { Request } from 'express'
import { Role } from '@repo/api'

export interface AuthenticatedUser {
  userId: string
  tenantId: string
  roles: Role
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser
}
