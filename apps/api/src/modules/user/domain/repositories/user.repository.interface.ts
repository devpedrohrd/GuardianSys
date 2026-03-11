import { CreateUserInput, UpdateUserInput, SearchUserFilter, PaginatedResponse } from '@repo/api'
import { UserEntity } from '../entities'

export interface IUserRepository {
  findById(tenantId: string, id: string): Promise<UserEntity | null>
  findByEmail(tenantId: string, email: string): Promise<UserEntity | null>
  findAll(tenantId: string, filter: SearchUserFilter): Promise<PaginatedResponse<UserEntity>>
  create(input: CreateUserInput): Promise<UserEntity>
  update(
    tenantId: string,
    id: string,
    input: UpdateUserInput,
  ): Promise<UserEntity>
  delete(tenantId: string, id: string): Promise<void>
}

export const USER_REPOSITORY = Symbol('IUserRepository')
