import { Client, CreateClientInput } from '@repo/api'

export class ClientEntity implements Client {
  readonly id: string
  readonly tenantId: string
  readonly name: string
  readonly email: string | null
  readonly phone: string | null
  readonly document: string | null
  readonly address: string | null
  readonly complement: string | null
  readonly observation: string | null
  readonly dateOfBirth: Date | null
  readonly createdById: string | null
  readonly updatedById: string | null
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly deletedAt: Date | null

  private constructor(props: Client) {
    this.id = props.id
    this.tenantId = props.tenantId
    this.name = props.name
    this.email = props.email
    this.phone = props.phone
    this.document = props.document
    this.address = props.address
    this.complement = props.complement
    this.observation = props.observation
    this.dateOfBirth = props.dateOfBirth
    this.createdById = props.createdById
    this.updatedById = props.updatedById
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
    this.deletedAt = props.deletedAt
  }

  static create(input: CreateClientInput): ClientEntity {
    const now = new Date()

    return new ClientEntity({
      id: '',
      tenantId: input.tenantId,
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      document: input.document ?? null,
      address: input.address ?? null,
      complement: input.complement ?? null,
      observation: input.observation ?? null,
      dateOfBirth: input.dateOfBirth ?? null,
      createdById: input.createdById ?? null,
      updatedById: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    })
  }

  static restore(data: Client): ClientEntity {
    return new ClientEntity(data)
  }
}
