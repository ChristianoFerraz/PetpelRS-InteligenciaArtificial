/*
  Warnings:

  - You are about to drop the column `adminId` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `Contato` table. All the data in the column will be lost.
  - You are about to drop the column `resposta` on the `Contato` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Animal" DROP CONSTRAINT "Animal_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Contato" DROP CONSTRAINT "Contato_adminId_fkey";

-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "adminId";

-- AlterTable
ALTER TABLE "Cliente" ALTER COLUMN "role" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Contato" DROP COLUMN "adminId",
DROP COLUMN "resposta";

-- DropTable
DROP TABLE "Admin";
