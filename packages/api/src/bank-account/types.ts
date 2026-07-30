export interface BankAccount {
  id: string
  tenantId: string
  name: string
  bankCode: string | null
  agency: string | null
  agencyDigit: string | null
  accountNumber: string | null
  accountDigit: string | null
  pixKey: string | null
  createdById: string | null
  updatedById: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface CreateBankAccountInput {
  tenantId: string
  name: string
  bankCode?: string | null
  agency?: string | null
  agencyDigit?: string | null
  accountNumber?: string | null
  accountDigit?: string | null
  pixKey?: string | null
  createdById?: string | null
}

export interface UpdateBankAccountInput
  extends Partial<Omit<CreateBankAccountInput, 'tenantId' | 'createdById'>> {
  updatedById?: string | null
}

export interface SearchBankAccountFilter {
  skip?: number
  limit?: number
  name?: string
  bankCode?: string
  tenantId?: string
}
