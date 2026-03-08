import { Test, TestingModule } from '@nestjs/testing'
import { FindUserByIdUseCase } from './find-user-by-id.use-case'
import { USER_REPOSITORY } from '../../domain/repositories'
import {
  InsufficientPermissionsException,
  UserNotFoundException,
} from '../../domain/exceptions'
import { UserEntity } from '../../domain/entities'

describe('FindUserByIdUseCase', () => {
  let useCase: FindUserByIdUseCase
  let userRepository: any

  beforeEach(async () => {
    userRepository = {
      findById: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByIdUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
      ],
    }).compile()

    useCase = module.get<FindUserByIdUseCase>(FindUserByIdUseCase)
  })

  it('should throw UserNotFoundException if target user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute('tenant-1', 'target-user', 'executor-1'),
    ).rejects.toThrow(UserNotFoundException)
  })

  it('should allow user to view their own profile even without canViewOthers permission', async () => {
    const user = UserEntity.restore({
      id: 'executor-1',
      tenantId: 'tenant-1',
      name: 'Executor',
      email: 'exec@test.com',
      roles: 'INVESTIGATOR',
      createdById: null,
      canViewOthers: false,
      canEditOthers: false,
      canDeleteOthers: false,
      canDeleteOwn: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Target user resolves to the executor itself
    userRepository.findById.mockResolvedValueOnce(user)

    const result = await useCase.execute('tenant-1', 'executor-1', 'executor-1')
    expect(result).toBe(user)
    expect(userRepository.findById).toHaveBeenCalledTimes(1) // only fetched the target, no need to fetch executor
  })

  it('should throw InsufficientPermissionsException if executor cannot view others', async () => {
    const targetUser = UserEntity.restore({
      id: 'target-1',
      tenantId: 'tenant-1',
      name: 'Target',
      email: 'target@test.com',
      roles: 'INVESTIGATOR',
      createdById: null,
      canViewOthers: false,
      canEditOthers: false,
      canDeleteOthers: false,
      canDeleteOwn: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const executorUser = UserEntity.restore({
      id: 'executor-1',
      tenantId: 'tenant-1',
      name: 'Executor',
      email: 'exec@test.com',
      roles: 'INVESTIGATOR',
      createdById: null,
      canViewOthers: false,
      canEditOthers: false,
      canDeleteOthers: false,
      canDeleteOwn: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    userRepository.findById
      .mockResolvedValueOnce(targetUser) // first call gets target
      .mockResolvedValueOnce(executorUser) // second call gets executor

    await expect(
      useCase.execute('tenant-1', 'target-1', 'executor-1'),
    ).rejects.toThrow(InsufficientPermissionsException)
  })

  it('should allow executor to view others if they have canViewOthers permission', async () => {
    const targetUser = UserEntity.restore({
      id: 'target-1',
      tenantId: 'tenant-1',
      name: 'Target',
      email: 'target@test.com',
      roles: 'INVESTIGATOR',
      createdById: null,
      canViewOthers: false,
      canEditOthers: false,
      canDeleteOthers: false,
      canDeleteOwn: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const executorUser = UserEntity.restore({
      id: 'executor-1',
      tenantId: 'tenant-1',
      name: 'Executor',
      email: 'exec@test.com',
      roles: 'INVESTIGATOR',
      createdById: null,
      canViewOthers: true,
      canEditOthers: false,
      canDeleteOthers: false,
      canDeleteOwn: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    userRepository.findById
      .mockResolvedValueOnce(targetUser) // first call gets target
      .mockResolvedValueOnce(executorUser) // second call gets executor

    const result = await useCase.execute('tenant-1', 'target-1', 'executor-1')
    expect(result).toBe(targetUser)
  })
})
