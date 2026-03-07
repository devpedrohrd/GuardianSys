import { Inject, Injectable } from '@nestjs/common'
import { CreateTenantInput } from '@repo/api'
import { TenantEntity } from '../../domain/entities'
import { ITenantRepository, TENANT_REPOSITORY } from '../../domain/repositories'
import { TenantAlreadyExistsException } from '../../domain/exceptions'

@Injectable()
export class CreateTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(input: CreateTenantInput): Promise<TenantEntity> {
    TenantEntity.create(input)

    const existing = await this.tenantRepository.findBySlug(input.slug)
    if (existing) {
      throw new TenantAlreadyExistsException(input.slug)
    }

    return this.tenantRepository.create(input)
  }
}
