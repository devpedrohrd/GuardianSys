import { Tenant, CreateTenantInput } from '@repo/api'
import { Email } from '../value-objects'
import { Phone } from '../value-objects'
import { InvalidTenantDataException } from '../exceptions'

export class TenantEntity implements Tenant {
  readonly id: string
  readonly name: string
  readonly slug: string
  readonly customDomain: string | null
  readonly logoUrl: string | null
  readonly faviconUrl: string | null
  readonly primaryColor: string | null
  readonly secondaryColor: string | null
  readonly displayName: string | null
  readonly document: string | null
  readonly email: string | null
  readonly phone: string | null
  readonly address: string | null
  readonly plan: string | null
  readonly isActive: boolean
  readonly createdAt: Date
  readonly updatedAt: Date

  private constructor(props: Tenant) {
    this.id = props.id
    this.name = props.name
    this.slug = props.slug
    this.customDomain = props.customDomain
    this.logoUrl = props.logoUrl
    this.faviconUrl = props.faviconUrl
    this.primaryColor = props.primaryColor
    this.secondaryColor = props.secondaryColor
    this.displayName = props.displayName
    this.document = props.document
    this.email = props.email
    this.phone = props.phone
    this.address = props.address
    this.plan = props.plan
    this.isActive = props.isActive
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  static create(input: CreateTenantInput): TenantEntity {
    if (!input.name || input.name.trim().length < 2) {
      throw new InvalidTenantDataException(
        'Tenant name must be at least 2 characters',
      )
    }

    if (!input.slug || input.slug.trim().length < 2) {
      throw new InvalidTenantDataException(
        'Tenant slug must be at least 2 characters',
      )
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(input.slug)) {
      throw new InvalidTenantDataException(
        'Slug must contain only lowercase letters, numbers, and hyphens',
      )
    }

    if (input.email) {
      Email.create(input.email)
    }

    if (input.phone) {
      Phone.create(input.phone)
    }

    const now = new Date()

    return new TenantEntity({
      id: '',
      name: input.name.trim(),
      slug: input.slug.trim().toLowerCase(),
      customDomain: input.customDomain ?? null,
      logoUrl: input.logoUrl ?? null,
      faviconUrl: input.faviconUrl ?? null,
      primaryColor: input.primaryColor ?? null,
      secondaryColor: input.secondaryColor ?? null,
      displayName: input.displayName ?? null,
      document: input.document ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      address: input.address ?? null,
      plan: input.plan ?? null,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })
  }

  static restore(data: Tenant): TenantEntity {
    return new TenantEntity(data)
  }
}
