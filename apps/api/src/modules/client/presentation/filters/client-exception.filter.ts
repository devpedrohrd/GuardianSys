import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'
import {
  ClientException,
  ClientNotFoundException,
  ClientAlreadyExistsException,
  ClientAlreadyDeletedException,
  CondominiumNotFoundException,
  ClientCondominiumAlreadyExistsException,
  ClientCondominiumNotFoundException,
} from '../../domain/exceptions'

const EXCEPTION_STATUS_MAP = new Map<string, HttpStatus>([
  [ClientNotFoundException.name, HttpStatus.NOT_FOUND],
  [ClientAlreadyExistsException.name, HttpStatus.CONFLICT],
  [ClientAlreadyDeletedException.name, HttpStatus.CONFLICT],
  [CondominiumNotFoundException.name, HttpStatus.NOT_FOUND],
  [ClientCondominiumAlreadyExistsException.name, HttpStatus.CONFLICT],
  [ClientCondominiumNotFoundException.name, HttpStatus.NOT_FOUND],
])

@Catch(ClientException)
export class ClientExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ClientExceptionFilter.name)

  catch(exception: ClientException, host: ArgumentsHost) {
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
