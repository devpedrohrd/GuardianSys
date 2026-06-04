import { ClientCondominium } from '@repo/api'

export class ClientCondominiumEntity implements ClientCondominium {
  readonly clientId: string
  readonly condominiumId: string
  readonly createdAt: Date

  private constructor(props: ClientCondominium) {
    this.clientId = props.clientId
    this.condominiumId = props.condominiumId
    this.createdAt = props.createdAt
  }

  static create(clientId: string, condominiumId: string): ClientCondominiumEntity {
    return new ClientCondominiumEntity({
      clientId,
      condominiumId,
      createdAt: new Date(),
    })
  }

  static restore(data: ClientCondominium): ClientCondominiumEntity {
    return new ClientCondominiumEntity(data)
  }
}
