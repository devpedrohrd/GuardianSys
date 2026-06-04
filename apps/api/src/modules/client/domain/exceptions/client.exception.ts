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

export class ClientAlreadyExistsException extends ClientException {
  constructor(name: string) {
    super(
      `Cliente com nome ${name} já existe`,
      'CLIENT_ALREADY_EXISTS')
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

export class CondominiumNotFoundException extends ClientException {
  constructor(condominiumId: string) {
    super(
      `Condomínio com ID ${condominiumId} não encontrado`,
      'CONDOMINIUM_NOT_FOUND',
    )
  }
}

export class ClientCondominiumAlreadyExistsException extends ClientException {
  constructor(clientId: string, condominiumId: string) {
    super(
      `Cliente ${clientId} já está vinculado ao condomínio ${condominiumId}`,
      'CLIENT_CONDOMINIUM_ALREADY_EXISTS',
    )
  }
}

export class ClientCondominiumNotFoundException extends ClientException {
  constructor(clientId: string, condominiumId: string) {
    super(
      `Vínculo entre cliente ${clientId} e condomínio ${condominiumId} não encontrado`,
      'CLIENT_CONDOMINIUM_NOT_FOUND',
    )
  }
}
