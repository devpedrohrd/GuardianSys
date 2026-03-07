import { Inject, Injectable } from '@nestjs/common'
import { UpdateTenantInput } from '@repo/api'
import { TenantEntity } from '../../domain/entities'
import { ITenantRepository, TENANT_REPOSITORY } from '../../domain/repositories'
import { TenantNotFoundException } from '../../domain/exceptions'

@Injectable()
export class UpdateTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(id: string, input: UpdateTenantInput): Promise<TenantEntity> {
    const existing = await this.tenantRepository.findById(id)

    if (!existing) {
      throw new TenantNotFoundException(id)
    }

    return this.tenantRepository.update(id, input)
  }
}
