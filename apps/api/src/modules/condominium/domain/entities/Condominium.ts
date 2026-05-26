import { Condominium, CreateCondominiumInput } from '@repo/api'

export class CondominiumEntity implements Condominium {
  id: string
  tenantId: string
  name: string
  manager: string
  managerContact: string
  conciergeContact: string
  address: string
  openingDate: Date
  createdBy: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null

  private constructor(props: Condominium) {
    this.id = props.id
    this.tenantId = props.tenantId
    this.name = props.name
    this.manager = props.manager
    this.managerContact = props.managerContact
    this.conciergeContact = props.conciergeContact
    this.address = props.address
    this.openingDate = props.openingDate
    this.createdBy = props.createdBy
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
    this.deletedAt = props.deletedAt ?? null
  }

  static create(data: CreateCondominiumInput): CondominiumEntity {
    return new CondominiumEntity({
      id: '',
      tenantId: data.tenantId,
      name: data.name,
      manager: data.manager,
      managerContact: data.managerContact,
      conciergeContact: data.conciergeContact,
      address: data.address,
      openingDate: data.openingDate,
      createdBy: data.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })
  }

  static restore(data: Condominium): CondominiumEntity {
    return new CondominiumEntity(data)
  }
}
