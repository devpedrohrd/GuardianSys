export abstract class ClientException extends Error {
  readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = this.constructor.name
    this.code = code
  }
}

export class ClientNotFoundException extends ClientException {
  constructor(clientId: string) {
    super(`Cliente com ID ${clientId} não encontrado`, 'CLIENT_NOT_FOUND')
  }
}

export class ClientAlreadyDeletedException extends ClientException {
  constructor(clientId: string) {
    super(
      `Cliente com ID ${clientId} já foi removido`,
      'CLIENT_ALREADY_DELETED',
    )
  }
}
