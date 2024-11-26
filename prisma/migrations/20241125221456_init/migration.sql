/*
  Warnings:

  - You are about to drop the column `EstadoRegistro` on the `registrovisita` table. All the data in the column will be lost.
  - Added the required column `EstadoSolicitud` to the `RegistroVisita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `registrovisita` DROP COLUMN `EstadoRegistro`,
    ADD COLUMN `EstadoSolicitud` ENUM('Ingresada', 'Aceptada', 'Rechazada') NOT NULL;
