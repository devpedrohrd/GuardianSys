import { Prisma } from '@prisma/client'
import { SearchCondominiumInput, UpdateCondominiumInput } from '@repo/api'

const filterStrings = [
  'name',
  'manager',
  'managerContact',
  'conciergeContact',
  'address',
] as const

export const buildSearchFilters = (filter: SearchCondominiumInput) => {
  const { skip, limit, ...rest } = filter

  const where: Record<string, unknown> = {
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

  return { skip, limit, where: where as Prisma.CondominiumWhereInput }
}

export const buildUpdateFilters = (filter: UpdateCondominiumInput) => {
  const where: Prisma.CondominiumUpdateInput = {}

  for (const [key, value] of Object.entries(filter)) {
    if (value) {
      where[key] = value
    }
  }

  return where as Prisma.CondominiumUpdateInput
}
