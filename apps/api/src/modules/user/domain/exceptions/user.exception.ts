export abstract class UserException extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

export class UserNotFoundException extends UserException {
  constructor(userId: string) {
    super(`Usuário com ID ${userId} não encontrado`, 'USER_NOT_FOUND')
  }
}

export class UserAlreadyExistsException extends UserException {
  constructor(email: string) {
    super(`Já existe um usuário com o e-mail ${email}`, 'USER_ALREADY_EXISTS')
  }
}

export class InsufficientPermissionsException extends UserException {
  constructor() {
    super(
      'Você não tem permissão para realizar esta ação',
      'INSUFFICIENT_PERMISSIONS',
    )
  }
}
