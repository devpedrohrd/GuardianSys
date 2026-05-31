export interface Client {
  id: string
  tenantId: string
  name: string
  email: string | null
  phone: string | null
  document: string | null
  address: string | null
  complement: string | null
  observation: string | null
  dateOfBirth: Date | null
  createdById: string | null
  updatedById: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface CreateClientInput {
  tenantId: string
  name: string
  email?: string | null
  phone?: string | null
  document?: string | null
  address?: string | null
  complement?: string | null
  observation?: string | null
  dateOfBirth?: Date | null
  createdById?: string | null
}

export interface UpdateClientInput
  extends Partial<Omit<CreateClientInput, 'tenantId' | 'createdById'>> {
  updatedById?: string | null
}

export interface SearchClientFilter {
  skip?: number
  limit?: number
  name?: string
  email?: string
  document?: string
  tenantId?: string
}
