export abstract class AuthException extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

export class InvalidCredentialsException extends AuthException {
  constructor() {
    super('E-mail ou senha inválidos', 'INVALID_CREDENTIALS')
  }
}

export class EmailAlreadyExistsException extends AuthException {
  constructor(email: string) {
    super(`Já existe um usuário com o e-mail ${email}`, 'EMAIL_ALREADY_EXISTS')
  }
}

export class TenantSlugAlreadyExistsException extends AuthException {
  constructor(slug: string) {
    super(
      `Já existe uma empresa com o slug ${slug}`,
      'TENANT_SLUG_ALREADY_EXISTS',
    )
  }
}

export class InactiveTenantException extends AuthException {
  constructor() {
    super('Esta empresa está inativa', 'INACTIVE_TENANT')
  }
}
