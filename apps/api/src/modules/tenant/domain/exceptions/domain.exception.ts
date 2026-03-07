export abstract class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

export class TenantNotFoundException extends DomainException {
  constructor(tenantId: string) {
    super(`Tenant with ID ${tenantId} not found`, 'TENANT_NOT_FOUND')
  }
}

export class InvalidTenantDataException extends DomainException {
  constructor(message: string) {
    super(message, 'INVALID_TENANT_DATA')
  }
}

export class TenantAlreadyExistsException extends DomainException {
  constructor(tenantName: string) {
    super(
      `Tenant with name ${tenantName} already exists`,
      'TENANT_ALREADY_EXISTS',
    )
  }
}

export class InvalidTenantPlanException extends DomainException {
  constructor(plan: string) {
    super(`Invalid tenant plan: ${plan}`, 'INVALID_TENANT_PLAN')
  }
}

export class TenantUnauthorizedException extends DomainException {
  constructor() {
    super('Unauthorized to access tenant', 'TENANT_UNAUTHORIZED')
  }
}

export class TenantInactiveException extends DomainException {
  constructor() {
    super('Tenant is inactive', 'TENANT_INACTIVE')
  }
}
