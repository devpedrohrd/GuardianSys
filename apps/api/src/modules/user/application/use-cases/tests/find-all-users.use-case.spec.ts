import { Test, TestingModule } from '@nestjs/testing'
import { FindAllUsersUseCase } from '../find-all-users.use-case'
import { USER_REPOSITORY } from '../../../domain/repositories'
import { InsufficientPermissionsException } from '../../../domain/exceptions'
import { UserEntity } from '../../../domain/entities'

describe('FindAllUsersUseCase', () => {
  let useCase: FindAllUsersUseCase
  let userRepository: any

  beforeEach(async () => {
    userRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllUsersUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
      ],
    }).compile()

    useCase = module.get<FindAllUsersUseCase>(FindAllUsersUseCase)
  })

  it('should throw InsufficientPermissionsException if executor is not found', async () => {
    userRepository.findById.mockResolvedValue(null)

    await expect(useCase.execute('tenant-1', {}, 'executor-1')).rejects.toThrow(
      InsufficientPermissionsException,
    )
  })

  it('should restrict filter to executor id if user cannot view others', async () => {
    const executor = UserEntity.restore({
      id: 'executor-1',
      tenantId: 'tenant-1',
      name: 'Executor',
      email: 'exec@test.com',
      role: 'INVESTIGATOR',
      createdById: null,
      canManageProducts: false,
      canCreateCharges: true,
      canExportData: false,
      canReopenCases: false,
      canViewOthers: false,
      canEditOthers: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    userRepository.findById.mockResolvedValue(executor)
    userRepository.findAll.mockResolvedValue({ users: [executor], total: 1 })

    const filter = { name: 'Executor' }
    const result = await useCase.execute('tenant-1', filter, 'executor-1')

    expect(filter).toHaveProperty('id', 'executor-1')
    expect(userRepository.findAll).toHaveBeenCalledWith('tenant-1', {
      name: 'Executor',
      id: 'executor-1',
    })
    expect(result).toEqual({ users: [executor], total: 1 })
  })

  it('should not restrict filter if user can view others', async () => {
    const executor = UserEntity.restore({
      id: 'executor-1',
      tenantId: 'tenant-1',
      name: 'Executor',
      email: 'exec@test.com',
      role: 'INVESTIGATOR',
      createdById: null,
      canManageProducts: false,
      canCreateCharges: true,
      canExportData: false,
      canReopenCases: false,
      canViewOthers: true,
      canEditOthers: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    userRepository.findById.mockResolvedValue(executor)
    userRepository.findAll.mockResolvedValue({ users: [executor], total: 1 })

    const filter = { name: 'Executor' }
    await useCase.execute('tenant-1', filter, 'executor-1')

    expect(filter).not.toHaveProperty('id')
    expect(userRepository.findAll).toHaveBeenCalledWith('tenant-1', {
      name: 'Executor',
    })
  })
})
