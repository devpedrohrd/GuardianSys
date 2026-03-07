import { Role } from '@repo/api'

export interface JwtPayload {
  sub: string
  tenantId: string
  roles: Role
}
