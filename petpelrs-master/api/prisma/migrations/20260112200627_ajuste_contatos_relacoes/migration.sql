/*
  Warnings:

  - You are about to drop the column `clienteId` on the `Contato` table. All the data in the column will be lost.
  - Added the required column `destinatarioId` to the `Contato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remetenteId` to the `Contato` table without a default value. This is not possible if the table is not empty.
  - Made the column `animalId` on table `Contato` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Contato" DROP CONSTRAINT "Contato_animalId_fkey";

-- DropForeignKey
ALTER TABLE "Contato" DROP CONSTRAINT "Contato_clienteId_fkey";

-- AlterTable
ALTER TABLE "Contato" DROP COLUMN "clienteId",
ADD COLUMN     "destinatarioId" INTEGER NOT NULL,
ADD COLUMN     "remetenteId" INTEGER NOT NULL,
ALTER COLUMN "animalId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Contato_animalId_idx" ON "Contato"("animalId");

-- CreateIndex
CREATE INDEX "Contato_remetenteId_idx" ON "Contato"("remetenteId");

-- CreateIndex
CREATE INDEX "Contato_destinatarioId_idx" ON "Contato"("destinatarioId");

-- AddForeignKey
ALTER TABLE "Contato" ADD CONSTRAINT "Contato_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contato" ADD CONSTRAINT "Contato_remetenteId_fkey" FOREIGN KEY ("remetenteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contato" ADD CONSTRAINT "Contato_destinatarioId_fkey" FOREIGN KEY ("destinatarioId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
