export abstract class CondominiumException extends Error {
  constructor(message: string, code: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class CondominiumNotFoundException extends CondominiumException {
  constructor(condominiumId: string) {
    super(
      `Condomínio com ID ${condominiumId} não encontrado`,
      'CONDOMINIUM_NOT_FOUND',
    )
  }
}

export class CondominiumAlreadyExistsException extends CondominiumException {
  constructor(name: string) {
    super(
      `Já existe um condomínio com o nome ${name}`,
      'CONDOMINIUM_ALREADY_EXISTS',
    )
  }
}

export class CondominiumHasNoTenantException extends CondominiumException {
  constructor(condominiumId: string) {
    super(
      `Condomínio com ID ${condominiumId} não possui um tenant`,
      'CONDOMINIUM_HAS_NO_TENANT',
    )
  }
}

export class CondominiumNotBelongsToTenantException extends CondominiumException {
  constructor(condominiumId: string) {
    super(
      `Condomínio com ID ${condominiumId} não pertence ao tenant`,
      'CONDOMINIUM_NOT_BELONGS_TO_TENANT',
    )
  }
}
