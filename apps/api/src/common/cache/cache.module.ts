import { Global, Module } from '@nestjs/common'
import { CacheService } from './cache.service'
import { CACHE_SERVICE } from './cache.constants'

@Global()
@Module({
  providers: [
    {
      provide: CACHE_SERVICE,
      useClass: CacheService,
    },
  ],
  exports: [CACHE_SERVICE],
})
export class CacheModule {}
