export abstract class BankAccountException extends Error {
  readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = this.constructor.name
    this.code = code
  }
}

export class BankAccountNotFoundException extends BankAccountException {
  constructor(id: string) {
    super(`Conta bancária com ID ${id} não encontrada`, 'BANK_ACCOUNT_NOT_FOUND')
  }
}

export class BankAccountAlreadyExistsException extends BankAccountException {
  constructor(name: string) {
    super(
      `Conta bancária com nome "${name}" já existe`,
      'BANK_ACCOUNT_ALREADY_EXISTS',
    )
  }
}

export class BankAccountAlreadyDeletedException extends BankAccountException {
  constructor(id: string) {
    super(
      `Conta bancária com ID ${id} já foi removida`,
      'BANK_ACCOUNT_ALREADY_DELETED',
    )
  }
}

export class BankAccountValidationException extends BankAccountException {
  constructor(message: string) {
    super(message, 'BANK_ACCOUNT_VALIDATION_ERROR')
  }
}
