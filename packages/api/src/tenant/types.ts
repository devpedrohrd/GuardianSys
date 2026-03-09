export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
}

export enum Plan {
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

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
  plan: Plan | null
  subscriptionStatus: SubscriptionStatus | null
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
  plan?: Plan | null
  subscriptionStatus?: SubscriptionStatus | null
  isActive?: boolean
}

export interface UpdateTenantInput extends Partial<CreateTenantInput> {}
