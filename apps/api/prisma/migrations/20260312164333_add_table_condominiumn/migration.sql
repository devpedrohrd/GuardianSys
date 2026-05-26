-- CreateTable
CREATE TABLE "condominiums" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "manager" VARCHAR(255) NOT NULL,
    "manager_contact" VARCHAR(100),
    "concierge_contact" VARCHAR(100),
    "address" VARCHAR(500),
    "opening_date" DATE,
    "created_by_id" UUID,
    "updated_by_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "condominiums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_condominiums" (
    "user_id" UUID NOT NULL,
    "condominium_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_condominiums_pkey" PRIMARY KEY ("user_id","condominium_id")
);

-- CreateTable
CREATE TABLE "_CondominiumToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_CondominiumToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CondominiumToUser_B_index" ON "_CondominiumToUser"("B");

-- AddForeignKey
ALTER TABLE "condominiums" ADD CONSTRAINT "condominiums_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominiums" ADD CONSTRAINT "condominiums_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominiums" ADD CONSTRAINT "condominiums_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_condominiums" ADD CONSTRAINT "user_condominiums_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_condominiums" ADD CONSTRAINT "user_condominiums_condominium_id_fkey" FOREIGN KEY ("condominium_id") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CondominiumToUser" ADD CONSTRAINT "_CondominiumToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CondominiumToUser" ADD CONSTRAINT "_CondominiumToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
