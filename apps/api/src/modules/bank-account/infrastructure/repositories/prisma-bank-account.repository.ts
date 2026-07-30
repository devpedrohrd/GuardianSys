import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../../../config/database/Prisma.service'
import {
  CreateBankAccountInput,
  UpdateBankAccountInput,
  SearchBankAccountFilter,
  PaginatedResponse,
} from '@repo/api'
import { IBankAccountRepository } from '../../domain/repositories'
import { BankAccountEntity } from '../../domain/entities'
import { BankAccountValidationException } from '../../domain/exceptions'
import { PrismaBankAccountMapper } from '../mappers/prisma-bank-account.mapper'
import { buildSearchFilters, buildUpdateFilters } from '../filters'

const COLUMN_LABEL_MAP: Record<string, string> = {
  name: 'Nome',
  bank_code: 'Código do banco',
  agency: 'Agência',
  agency_digit: 'Dígito da agência',
  account_number: 'Número da conta',
  account_digit: 'Dígito da conta',
  pix_key: 'Chave PIX',
}

function handlePrismaError(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2000'
  ) {
    const meta = error.meta as { column?: string; driverAdapterError?: { cause?: { originalMessage?: string } } } | undefined
    const originalMessage = meta?.driverAdapterError?.cause?.originalMessage ?? ''

    const columnMatch = originalMessage.match(/column "?(\w+)"?/i)
    const lengthMatch = originalMessage.match(/varying\((\d+)\)/)

    const columnName = columnMatch?.[1]
    const maxLength = lengthMatch?.[1]

    const label = columnName ? (COLUMN_LABEL_MAP[columnName] ?? columnName) : 'Campo'
    const suffix = maxLength ? ` (máximo: ${maxLength} caracteres)` : ''

    throw new BankAccountValidationException(
      `${label}: valor excede o tamanho máximo permitido${suffix}`,
    )
  }

  throw error
}

@Injectable()
export class PrismaBankAccountRepository implements IBankAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(tenantId: string, id: string): Promise<BankAccountEntity | null> {
    const bankAccount = await this.prisma.bankAccount.findFirst({
      where: { id, tenantId, deletedAt: null },
    })

    if (!bankAccount) return null

    return PrismaBankAccountMapper.toDomain(bankAccount)
  }

  async findByName(tenantId: string, name: string): Promise<BankAccountEntity | null> {
    const bankAccount = await this.prisma.bankAccount.findFirst({
      where: {
        tenantId,
        name: { equals: name, mode: 'insensitive' },
        deletedAt: null,
      },
    })

    if (!bankAccount) return null

    return PrismaBankAccountMapper.toDomain(bankAccount)
  }

  async findAll(
    tenantId: string,
    filter: SearchBankAccountFilter,
  ): Promise<PaginatedResponse<BankAccountEntity>> {
    const {
      skip = 0,
      limit = 10,
      where,
    } = buildSearchFilters({
      ...filter,
      tenantId,
    })

    const [total, bankAccounts] = await Promise.all([
      this.prisma.bankAccount.count({ where }),
      this.prisma.bankAccount.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return {
      total,
      data: bankAccounts.map(PrismaBankAccountMapper.toDomain),
      limit,
      page: Math.floor(skip / limit) + 1,
    }
  }

  async create(input: CreateBankAccountInput): Promise<BankAccountEntity> {
    try {
      const bankAccount = await this.prisma.bankAccount.create({
        data: {
          tenantId: input.tenantId,
          name: input.name,
          bankCode: input.bankCode ?? null,
          agency: input.agency ?? null,
          agencyDigit: input.agencyDigit ?? null,
          accountNumber: input.accountNumber ?? null,
          accountDigit: input.accountDigit ?? null,
          pixKey: input.pixKey ?? null,
          createdById: input.createdById ?? null,
        },
      })

      return PrismaBankAccountMapper.toDomain(bankAccount)
    } catch (error) {
      handlePrismaError(error)
    }
  }

  async update(
    tenantId: string,
    id: string,
    input: UpdateBankAccountInput,
  ): Promise<BankAccountEntity> {
    try {
      const data = buildUpdateFilters(input)

      const bankAccount = await this.prisma.bankAccount.update({
        where: { id, tenantId },
        data,
      })

      return PrismaBankAccountMapper.toDomain(bankAccount)
    } catch (error) {
      handlePrismaError(error)
    }
  }

  async softDelete(tenantId: string, id: string): Promise<void> {
    await this.prisma.bankAccount.update({
      where: { id, tenantId },
      data: { deletedAt: new Date() },
    })
  }
}
