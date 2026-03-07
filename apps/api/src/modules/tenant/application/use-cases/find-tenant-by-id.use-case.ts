import { Inject, Injectable } from '@nestjs/common'
import { TenantEntity } from '../../domain/entities'
import { ITenantRepository, TENANT_REPOSITORY } from '../../domain/repositories'
import { TenantNotFoundException } from '../../domain/exceptions'

@Injectable()
export class FindTenantByIdUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(id: string): Promise<TenantEntity> {
    const tenant = await this.tenantRepository.findById(id)

    if (!tenant) {
      throw new TenantNotFoundException(id)
    }

    return tenant
  }
}
