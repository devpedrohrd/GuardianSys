import { Test, TestingModule } from '@nestjs/testing'
import { UpdateUserUseCase } from './update-user.use-case'
import { USER_REPOSITORY } from '../../domain/repositories'
import {
  InsufficientPermissionsException,
  UserNotFoundException,
} from '../../domain/exceptions'
import { UserEntity } from '../../domain/entities'
import * as bcrypt from 'bcryptjs'

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}))

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase
  let userRepository: any

  beforeEach(async () => {
    userRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
      ],
    }).compile()

    useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase)
  })

  it('should throw InsufficientPermissionsException if executor cannot edit others', async () => {
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

    userRepository.findById.mockResolvedValueOnce(executorUser)

    await expect(
      useCase.execute('tenant-1', 'target-1', { name: 'New Name' }, 'executor-1'),
    ).rejects.toThrow(InsufficientPermissionsException)
  })

  it('should throw UserNotFoundException if target user does not exist', async () => {
    const executorUser = UserEntity.restore({
      id: 'executor-1',
      tenantId: 'tenant-1',
      name: 'Executor',
      email: 'exec@test.com',
      roles: 'INVESTIGATOR',
      createdById: null,
      canViewOthers: false,
      canEditOthers: true,
      canDeleteOthers: false,
      canDeleteOwn: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    userRepository.findById
      .mockResolvedValueOnce(executorUser) // first call gets executor
      .mockResolvedValueOnce(null) // second call gets target

    await expect(
      useCase.execute('tenant-1', 'target-1', { name: 'New Name' }, 'executor-1'),
    ).rejects.toThrow(UserNotFoundException)
  })

  it('should allow user to update their own profile without canEditOthers permission', async () => {
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

    userRepository.findById.mockResolvedValueOnce(user) // gets target (itself)
    userRepository.update.mockResolvedValueOnce({ ...user, name: 'New Name' })

    const result = await useCase.execute(
      'tenant-1',
      'executor-1',
      { name: 'New Name' },
      'executor-1',
    )
    expect(result).toEqual({ ...user, name: 'New Name' })
    expect(userRepository.update).toHaveBeenCalledWith('tenant-1', 'executor-1', {
      name: 'New Name',
    })
  })

  it('should hash password before saving', async () => {
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

    userRepository.findById.mockResolvedValueOnce(user) // gets target (itself)
    userRepository.update.mockResolvedValueOnce({ ...user, password: 'hashed-password' })

    await useCase.execute(
      'tenant-1',
      'executor-1',
      { password: 'plain-password' },
      'executor-1',
    )
    
    expect(bcrypt.hash).toHaveBeenCalledWith('plain-password', 10)
    expect(userRepository.update).toHaveBeenCalledWith('tenant-1', 'executor-1', {
      password: 'hashed-password',
    })
  })
})
