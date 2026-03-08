import { SearchUserDto } from "../../presentation/dtos/search-user.dto"

export const BuildFilterDto = (filter: SearchUserDto & { tenantId: string }) => {
    const { skip, limit } = filter

    const where: Record<string, unknown> = {}

    for (const key in filter) {
        if (filter[key] !== undefined) {
            if (key === 'name' || key === 'email') {
                where[key] = { contains: filter[key], mode: 'insensitive' }
            } else {
                where[key] = filter[key]
            }
        }
    }

    return { skip, limit, where }
}