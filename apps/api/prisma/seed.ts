import 'dotenv/config'
import * as bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@guardiansys.com'
  const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123'
  const name = process.env.SUPER_ADMIN_NAME || 'Super Admin'

  const hashedPassword = await bcrypt.hash(password, 10)

  const existing = await prisma.user.findFirst({
    where: { email: email.toLowerCase(), role: 'SUPER_ADMIN' },
  })

  if (existing) {
    console.log(`✅ SUPER_ADMIN já existe: ${existing.email} (${existing.id})`)
  } else {
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        tenantId: null,
        canManageProducts: false,
        canCreateCharges: false,
        canExportData: false,
        canReopenCases: false,
        canViewOthers: false,
        canEditOthers: false,
      },
    })

    console.log(`🌱 SUPER_ADMIN criado com sucesso:`)
    console.log(`   Email: ${user.email}`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   TenantId: ${user.tenantId}`)
  }

  await prisma.$disconnect()
  await pool.end()
}

main().catch((e) => {
  console.error('❌ Erro ao executar seed:', e)
  process.exit(1)
})
