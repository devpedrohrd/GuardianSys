export interface Tenant {
  id: string
  name: string
  slug: string
  customDomain: string | null
  logoUrl: string | null
  faviconUrl: string | null
  primaryColor: string | null
  secondaryColor: string | null
  displayName: string | null
  document: string | null
  email: string | null
  phone: string | null
  address: string | null
  plan: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateTenantInput {
  name: string
  slug: string
  customDomain?: string | null
  logoUrl?: string | null
  faviconUrl?: string | null
  primaryColor?: string | null
  secondaryColor?: string | null
  displayName?: string | null
  document?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  plan?: string | null
}

export interface UpdateTenantInput extends Partial<CreateTenantInput> {}
