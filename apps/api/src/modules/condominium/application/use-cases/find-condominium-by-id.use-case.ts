import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import {
  ICondominiumRepository,
  CONDOMINIUM_REPOSITORY,
} from '../../domain/repositories/condominium.repository.interface'
import { Condominium } from '@repo/api'
import { CondominiumNotFoundException } from '../../domain/exceptions/condominium.exception'

@Injectable()
export class FindCondominiumByIdUseCase {
  constructor(
    @Inject(CONDOMINIUM_REPOSITORY)
    private readonly condominiumRepository: ICondominiumRepository,
  ) {}

  async execute(id: string): Promise<Condominium> {
    const condominium = await this.condominiumRepository.findById(id)
    if (!condominium) {
      throw new CondominiumNotFoundException(id)
    }

    return condominium
  }
}
