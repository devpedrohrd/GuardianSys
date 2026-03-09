import { Role } from '@repo/api'

export interface JwtPayload {
  sub: string
  tenantId: string | null
  role: Role
}
