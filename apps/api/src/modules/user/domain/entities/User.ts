import { User } from '@repo/api'

type UserData = User | (Omit<User, 'password'> & { password?: string })

export class UserEntity implements Omit<User, 'password'> {
  readonly id: string
  readonly tenantId: string
  readonly uid: string
  readonly name: string
  readonly email: string
  readonly roles: User['roles']
  readonly createdById: string | null
  readonly canViewOthers: boolean
  readonly canEditOthers: boolean
  readonly canDeleteOthers: boolean
  readonly canDeleteOwn: boolean
  readonly createdAt: Date
  readonly updatedAt: Date

  private constructor(props: Omit<User, 'password'>) {
    this.id = props.id
    this.tenantId = props.tenantId
    this.uid = props.uid
    this.name = props.name
    this.email = props.email
    this.roles = props.roles
    this.createdById = props.createdById
    this.canViewOthers = props.canViewOthers
    this.canEditOthers = props.canEditOthers
    this.canDeleteOthers = props.canDeleteOthers
    this.canDeleteOwn = props.canDeleteOwn
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static restore({ password, ...data }: UserData): UserEntity {
    return new UserEntity(data)
  }
}
