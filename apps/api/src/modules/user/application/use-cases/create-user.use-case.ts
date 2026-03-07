import { Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { UserEntity } from '../../domain/entities'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories'
import { UserAlreadyExistsException } from '../../domain/exceptions'

interface CreateUserCommand {
  tenantId: string
  createdById: string
  uid: string
  name: string
  email: string
  password: string
  roles?: 'INVESTIGATOR' | 'ADMIN' | 'BILLING_AGENT'
  canViewOthers?: boolean
  canEditOthers?: boolean
  canDeleteOthers?: boolean
  canDeleteOwn?: boolean
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateUserCommand): Promise<UserEntity> {
    const existing = await this.userRepository.findByEmail(
      input.tenantId,
      input.email,
    )

    if (existing) {
      throw new UserAlreadyExistsException(input.email)
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)

    return this.userRepository.create({
      tenantId: input.tenantId,
      uid: input.uid,
      name: input.name,
      email: input.email.toLowerCase(),
      password: hashedPassword,
      roles: input.roles,
      createdById: input.createdById,
      canViewOthers: input.canViewOthers,
      canEditOthers: input.canEditOthers,
      canDeleteOthers: input.canDeleteOthers,
      canDeleteOwn: input.canDeleteOwn,
    })
  }
}
