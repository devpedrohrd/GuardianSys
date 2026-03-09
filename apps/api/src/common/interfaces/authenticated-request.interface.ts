import { Request } from 'express'
import { Role } from '@repo/api'

export interface AuthenticatedUser {
  userId: string
  tenantId: string | null
  role: Role
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser
}
