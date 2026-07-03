-- DropForeignKey
ALTER TABLE "Contato" DROP CONSTRAINT "Contato_animalId_fkey";

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contato" ADD CONSTRAINT "Contato_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
