import { Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import {
  ITenantRepository,
  TENANT_REPOSITORY,
} from '../../../tenant/domain/repositories'
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../user/domain/repositories'
import { UserEntity } from '../../../user/domain/entities'
import { CreateTenantAdminDto } from '../../presentation/dtos'
import {
  TenantNotFoundException,
  TenantInactiveException,
} from '../../../tenant/domain/exceptions'
import { UserAlreadyExistsException } from '../../../user/domain/exceptions'

@Injectable()
export class CreateTenantAdminUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    tenantId: string,
    input: CreateTenantAdminDto,
  ): Promise<UserEntity> {
    const tenant = await this.tenantRepository.findById(tenantId)

    if (!tenant) {
      throw new TenantNotFoundException(tenantId)
    }

    if (!tenant.isActive) {
      throw new TenantInactiveException()
    }

    const existingUser = await this.userRepository.findByEmail(
      tenantId,
      input.email,
    )

    if (existingUser) {
      throw new UserAlreadyExistsException(input.email)
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)

    return this.userRepository.create({
      tenantId,
      name: input.name,
      email: input.email.toLowerCase(),
      password: hashedPassword,
      role: 'ADMIN',
      createdById: null,
      canManageProducts: true,
      canCreateCharges: true,
      canExportData: true,
      canReopenCases: true,
      canViewOthers: true,
      canEditOthers: true,
    })
  }
}
