import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'
import {
  UserException,
  UserNotFoundException,
  UserAlreadyExistsException,
  InsufficientPermissionsException,
} from '../../domain/exceptions'

const EXCEPTION_STATUS_MAP = new Map<string, HttpStatus>([
  [UserNotFoundException.name, HttpStatus.NOT_FOUND],
  [UserAlreadyExistsException.name, HttpStatus.CONFLICT],
  [InsufficientPermissionsException.name, HttpStatus.FORBIDDEN],
])

@Catch(UserException)
export class UserExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(UserExceptionFilter.name)

  catch(exception: UserException, host: ArgumentsHost) {
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
