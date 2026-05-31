import { Prisma } from '@prisma/client'
import { SearchClientFilter, UpdateClientInput } from '@repo/api'

const filterStrings = ['name', 'email', 'document'] as const

export const buildSearchFilters = (
  filter: SearchClientFilter & { tenantId: string },
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

  return { skip, limit, where: where as Prisma.ClientWhereInput }
}

export const buildUpdateFilters = (filter: UpdateClientInput) => {
  const where: Prisma.ClientUpdateInput = {}

  for (const [key, value] of Object.entries(filter)) {
    if (value !== undefined) {
      ;(where as any)[key] = value
    }
  }

  return where as Prisma.ClientUpdateInput
}
