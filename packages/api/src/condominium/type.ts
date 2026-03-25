export interface Condominium {
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
  deletedAt?: Date | null
}

export interface CreateCondominiumInput {
  tenantId: string
  name: string
  manager: string
  managerContact: string
  conciergeContact: string
  address: string
  openingDate: Date
  createdBy: string
}

export interface UpdateCondominiumInput
  extends Partial<
    Omit<
      Condominium,
      'createdBy' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'id'
    >
  > {}

export interface SearchCondominiumInput {
  skip?: number
  limit?: number
  orderBy?: keyof Condominium
  id?: string
  tenantId?: string
  name?: string
  manager?: string
  managerContact?: string
  conciergeContact?: string
  address?: string
  openingDate?: Date
  createdBy?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
