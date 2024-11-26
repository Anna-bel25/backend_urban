/*
  Warnings:

  - The values [Registrada,Completada,Cancelada] on the enum `RegistroVisita_EstadoRegistro` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropIndex
DROP INDEX `RegistroVisita_CedulaResidente_fkey` ON `registrovisita`;

-- DropIndex
DROP INDEX `RegistroVisita_CedulaVisitante_fkey` ON `registrovisita`;

-- DropIndex
DROP INDEX `SolicitudVisita_CedulaResidente_fkey` ON `solicitudvisita`;

-- DropIndex
DROP INDEX `SolicitudVisita_CedulaVisitante_fkey` ON `solicitudvisita`;

-- AlterTable
ALTER TABLE `registrovisita` MODIFY `EstadoRegistro` ENUM('Ingresada', 'Aceptada', 'Rechazada') NOT NULL;

-- AddForeignKey
ALTER TABLE `SolicitudVisita` ADD CONSTRAINT `SolicitudVisita_CedulaVisitante_fkey` FOREIGN KEY (`CedulaVisitante`) REFERENCES `Usuario`(`NumeroCedula`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SolicitudVisita` ADD CONSTRAINT `SolicitudVisita_CedulaResidente_fkey` FOREIGN KEY (`CedulaResidente`) REFERENCES `Usuario`(`NumeroCedula`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroVisita` ADD CONSTRAINT `RegistroVisita_CedulaResidente_fkey` FOREIGN KEY (`CedulaResidente`) REFERENCES `Usuario`(`NumeroCedula`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroVisita` ADD CONSTRAINT `RegistroVisita_CedulaVisitante_fkey` FOREIGN KEY (`CedulaVisitante`) REFERENCES `Usuario`(`NumeroCedula`) ON DELETE RESTRICT ON UPDATE CASCADE;
