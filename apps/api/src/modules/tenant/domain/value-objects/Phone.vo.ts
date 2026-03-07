import { InvalidTenantDataException } from '../exceptions'

export class Phone {
  private constructor(public readonly value: string) {}

  static create(phone: string | null | undefined): Phone | null {
    if (!phone || phone.trim() === '') {
      return null
    }

    const cleanPhone = phone.replace(/\D/g, '')

    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      throw new InvalidTenantDataException('Phone must have 10 or 11 digits')
    }

    return new Phone(Phone.format(cleanPhone))
  }

  private static format(phone: string): string {
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }

  getUnformatted(): string {
    return this.value.replace(/\D/g, '')
  }

  equals(other: Phone | null): boolean {
    if (!other) return false
    return this.getUnformatted() === other.getUnformatted()
  }

  toString(): string {
    return this.value
  }
}
