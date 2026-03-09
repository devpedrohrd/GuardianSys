import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { AuthenticatedRequest } from '../interfaces'

@Injectable()
export class BackofficeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const user = request.user

    if (!user || user.tenantId !== null) {
      throw new ForbiddenException(
        'Acesso restrito ao backoffice. Apenas SUPER_ADMIN sem tenant pode acessar.',
      )
    }

    return true
  }
}
