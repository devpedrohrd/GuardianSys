import { Module } from '@nestjs/common'
import { TenantModule } from './modules/tenant/tenant.module'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [TenantModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
