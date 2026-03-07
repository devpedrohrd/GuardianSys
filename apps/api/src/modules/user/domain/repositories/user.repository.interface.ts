import { CreateUserInput, UpdateUserInput, User } from '@repo/api'
import { UserEntity } from '../entities'

export interface SearchUsersFilter {
  skip?: number
  limit?: number
  name?: string
  email?: string
}

export interface PaginatedUsers {
  total: number
  users: UserEntity[]
}

export interface IUserRepository {
  findById(tenantId: string, id: string): Promise<UserEntity | null>
  findByEmail(tenantId: string, email: string): Promise<UserEntity | null>
  findAll(tenantId: string, filter: SearchUsersFilter): Promise<PaginatedUsers>
  create(input: CreateUserInput): Promise<UserEntity>
  update(
    tenantId: string,
    id: string,
    input: UpdateUserInput,
  ): Promise<UserEntity>
  delete(tenantId: string, id: string): Promise<void>
}

export const USER_REPOSITORY = Symbol('IUserRepository')
