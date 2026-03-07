import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'
import {
  DomainException,
  TenantNotFoundException,
  InvalidTenantDataException,
  TenantAlreadyExistsException,
  TenantInactiveException,
  TenantUnauthorizedException,
} from '../../domain/exceptions'

const EXCEPTION_STATUS_MAP = new Map<string, HttpStatus>([
  [TenantNotFoundException.name, HttpStatus.NOT_FOUND],
  [InvalidTenantDataException.name, HttpStatus.BAD_REQUEST],
  [TenantAlreadyExistsException.name, HttpStatus.CONFLICT],
  [TenantInactiveException.name, HttpStatus.FORBIDDEN],
  [TenantUnauthorizedException.name, HttpStatus.UNAUTHORIZED],
])

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name)

  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status =
      EXCEPTION_STATUS_MAP.get(exception.constructor.name) ??
      HttpStatus.INTERNAL_SERVER_ERROR

    this.logger.warn(`[${exception.code}] ${exception.message}`)

    response.status(status).json({
      statusCode: status,
      error: exception.code,
      message: exception.message,
    })
  }
}
