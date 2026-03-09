import { Test, TestingModule } from '@nestjs/testing'
import { DeleteUserUseCase } from '../delete-user.use-case'
import { USER_REPOSITORY } from '../../../domain/repositories'
import {
  InsufficientPermissionsException,
  UserNotFoundException,
} from '../../../domain/exceptions'
import { UserEntity } from '../../../domain/entities'

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase
  let userRepository: any

  beforeEach(async () => {
    userRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
      ],
    }).compile()

    useCase = module.get<DeleteUserUseCase>(DeleteUserUseCase)
  })

  it('should throw InsufficientPermissionsException if executor not found', async () => {
    userRepository.findById.mockResolvedValueOnce(null)

    await expect(
      useCase.execute('tenant-1', 'target-1', 'executor-1'),
    ).rejects.toThrow(InsufficientPermissionsException)
  })

  it('should throw InsufficientPermissionsException if executor is not ADMIN or SUPER_ADMIN', async () => {
    const executorUser = UserEntity.restore({
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

    userRepository.findById.mockResolvedValueOnce(executorUser)

    await expect(
      useCase.execute('tenant-1', 'target-1', 'executor-1'),
    ).rejects.toThrow(InsufficientPermissionsException)
  })

  it('should allow executor to delete user if role is ADMIN', async () => {
    const executorUser = UserEntity.restore({
      id: 'executor-1',
      tenantId: 'tenant-1',
      name: 'Executor',
      email: 'exec@test.com',
      role: 'ADMIN',
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

    const targetUser = UserEntity.restore({
      id: 'target-1',
      tenantId: 'tenant-1',
      name: 'Target',
      email: 'target@test.com',
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

    userRepository.findById
      .mockResolvedValueOnce(executorUser) // fetch executor
      .mockResolvedValueOnce(targetUser) // fetch target

    await useCase.execute('tenant-1', 'target-1', 'executor-1')

    expect(userRepository.delete).toHaveBeenCalledWith('tenant-1', 'target-1')
  })

  it('should throw UserNotFoundException if target is not found', async () => {
    const executorUser = UserEntity.restore({
      id: 'executor-1',
      tenantId: 'tenant-1',
      name: 'Executor',
      email: 'exec@test.com',
      role: 'ADMIN',
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

    userRepository.findById
      .mockResolvedValueOnce(executorUser) // fetch executor
      .mockResolvedValueOnce(null) // target not found

    await expect(
      useCase.execute('tenant-1', 'target-1', 'executor-1'),
    ).rejects.toThrow(UserNotFoundException)
  })
})
