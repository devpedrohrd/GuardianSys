import { Prisma } from '@prisma/client'
import { SearchBankAccountFilter, UpdateBankAccountInput } from '@repo/api'

const filterStrings = ['name', 'bankCode'] as const

export const buildSearchFilters = (
  filter: SearchBankAccountFilter & { tenantId: string },
) => {
  const { skip, limit, tenantId, ...rest } = filter

  const where: Record<string, unknown> = {
    tenantId,
    deletedAt: null,
  }

  for (const key in rest) {
    const val = rest[key as keyof typeof rest]
    if (val !== undefined) {
      if (filterStrings.includes(key as (typeof filterStrings)[number])) {
        where[key] = { contains: val, mode: 'insensitive' }
      } else {
        where[key] = val
      }
    }
  }

  return { skip, limit, where: where as Prisma.BankAccountWhereInput }
}

export const buildUpdateFilters = (filter: UpdateBankAccountInput) => {
  const where: Prisma.BankAccountUpdateInput = {}

  for (const [key, value] of Object.entries(filter)) {
    if (value !== undefined) {
      ;(where as any)[key] = value
    }
  }

  return where as Prisma.BankAccountUpdateInput
}
