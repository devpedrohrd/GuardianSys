/*
  Warnings:

  - You are about to drop the column `uid` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenantId,id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_tenantId_uid_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "uid";

-- CreateIndex
CREATE UNIQUE INDEX "users_tenantId_id_key" ON "users"("tenantId", "id");
