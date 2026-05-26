import { Injectable, Inject } from '@nestjs/common'
import {
  ICondominiumRepository,
  CONDOMINIUM_REPOSITORY,
} from '../../domain/repositories/condominium.repository.interface'
import { SearchCondominiumDto } from '../../presentation/dtos/search-condominium.dto'
import { PaginatedResponse } from '@repo/api'
import { CondominiumEntity } from '../../domain/entities/Condominium'

@Injectable()
export class FindAllCondominiumsUseCase {
  constructor(
    @Inject(CONDOMINIUM_REPOSITORY)
    private readonly condominiumRepository: ICondominiumRepository,
  ) {}

  async execute(
    filter: SearchCondominiumDto,
  ): Promise<PaginatedResponse<CondominiumEntity>> {
    return await this.condominiumRepository.findAll(filter)
  }
}
