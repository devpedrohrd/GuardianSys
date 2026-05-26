import { Module } from '@nestjs/common'
import { TenantModule } from './modules/tenant/tenant.module'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { BackofficeModule } from './modules/backoffice/backoffice.module'
import { CondominiumModule } from './modules/condominium/condominium.module'

@Module({
  imports: [
    TenantModule,
    AuthModule,
    UserModule,
    BackofficeModule,
    CondominiumModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
