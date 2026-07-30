import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'
import {
  BankAccountException,
  BankAccountNotFoundException,
  BankAccountAlreadyExistsException,
  BankAccountAlreadyDeletedException,
  BankAccountValidationException,
} from '../../domain/exceptions'

const EXCEPTION_STATUS_MAP = new Map<string, HttpStatus>([
  [BankAccountNotFoundException.name, HttpStatus.NOT_FOUND],
  [BankAccountAlreadyExistsException.name, HttpStatus.CONFLICT],
  [BankAccountAlreadyDeletedException.name, HttpStatus.CONFLICT],
  [BankAccountValidationException.name, HttpStatus.BAD_REQUEST],
])

@Catch(BankAccountException)
export class BankAccountExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BankAccountExceptionFilter.name)

  catch(exception: BankAccountException, host: ArgumentsHost) {
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
