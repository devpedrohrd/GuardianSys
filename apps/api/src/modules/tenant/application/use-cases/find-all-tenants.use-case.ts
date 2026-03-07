import { Inject, Injectable } from '@nestjs/common'
import {
  ITenantRepository,
  TENANT_REPOSITORY,
  SearchTenantsFilter,
  PaginatedTenants,
} from '../../domain/repositories'

@Injectable()
export class FindAllTenantsUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(filter: SearchTenantsFilter): Promise<PaginatedTenants> {
    return this.tenantRepository.findAll(filter)
  }
}
