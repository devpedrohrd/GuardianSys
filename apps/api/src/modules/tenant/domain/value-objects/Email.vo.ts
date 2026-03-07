import { InvalidTenantDataException } from '../exceptions'

export class Email {
  private constructor(public readonly value: string) {}

  static create(email: string): Email {
    if (!email || email.trim() === '') {
      throw new InvalidTenantDataException('Email is required')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new InvalidTenantDataException(`Invalid email format: ${email}`)
    }

    if (email.length > 100) {
      throw new InvalidTenantDataException(
        'Email must be at most 100 characters',
      )
    }

    return new Email(email.toLowerCase().trim())
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
