import { User } from '@repo/api'

type UserData = Omit<User, 'password'> & { password?: string }

export class UserEntity implements Omit<User, 'password'> {
  readonly id: string
  readonly tenantId: string | null
  readonly name: string
  readonly email: string
  readonly role: User['role']
  readonly createdById: string | null
  readonly canManageProducts: boolean
  readonly canCreateCharges: boolean
  readonly canExportData: boolean
  readonly canReopenCases: boolean
  readonly canViewOthers: boolean
  readonly canEditOthers: boolean
  readonly createdAt: Date
  readonly updatedAt: Date

  private constructor(props: Omit<User, 'password'>) {
    this.id = props.id
    this.tenantId = props.tenantId
    this.name = props.name
    this.email = props.email
    this.role = props.role
    this.createdById = props.createdById
    this.canManageProducts = props.canManageProducts
    this.canCreateCharges = props.canCreateCharges
    this.canExportData = props.canExportData
    this.canReopenCases = props.canReopenCases
    this.canViewOthers = props.canViewOthers
    this.canEditOthers = props.canEditOthers
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static restore({ password, ...data }: UserData): UserEntity {
    return new UserEntity(data)
  }
}
