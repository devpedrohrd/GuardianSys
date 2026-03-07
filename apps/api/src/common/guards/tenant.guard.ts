import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { AuthenticatedRequest } from '../interfaces'

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const user = request.user

    if (!user || !user.tenantId) {
      throw new ForbiddenException('Tenant não identificado no token')
    }

    return true
  }
}
