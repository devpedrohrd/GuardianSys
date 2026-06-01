import { Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { UserEntity } from '../../domain/entities'
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories'
import { UserAlreadyExistsException } from '../../domain/exceptions'
import { CreateUserInput } from '@repo/api'
import { ICacheService, CACHE_SERVICE, CacheKeyBuilder } from '../../../../common/cache'

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(CACHE_SERVICE)
    private readonly cache: ICacheService,
  ) {}

  async execute(input: CreateUserInput): Promise<UserEntity> {
    const existing = await this.userRepository.findByEmail(
      input.tenantId as string,
      input.email,
    )

    if (existing) {
      throw new UserAlreadyExistsException(input.email)
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)

    const user = await this.userRepository.create({
      ...input,
      password: hashedPassword,
      email: input.email.toLowerCase(),
    })

    const tag = CacheKeyBuilder.forTag(input.tenantId as string, 'users')
    await this.cache.invalidateByTag(tag)

    return user
  }
}
