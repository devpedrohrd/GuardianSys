import { Inject, Injectable } from '@nestjs/common'
import { ITenantRepository, TENANT_REPOSITORY } from '../../domain/repositories'
import { TenantNotFoundException } from '../../domain/exceptions'

@Injectable()
export class DeleteTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.tenantRepository.findById(id)

    if (!existing) {
      throw new TenantNotFoundException(id)
    }

    await this.tenantRepository.delete(id)
  }
}
