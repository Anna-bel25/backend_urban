/*
  Warnings:

  - The values [Aceptada] on the enum `HistorialSolicitud_EstadoNuevo` will be removed. If these variants are still used in the database, this will fail.
  - The values [Aceptada] on the enum `HistorialSolicitud_EstadoNuevo` will be removed. If these variants are still used in the database, this will fail.
  - The values [Aceptada] on the enum `HistorialSolicitud_EstadoNuevo` will be removed. If these variants are still used in the database, this will fail.
  - The values [Aceptada] on the enum `HistorialSolicitud_EstadoNuevo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `historialsolicitud` MODIFY `EstadoAnterior` ENUM('Ingresada', 'Aprobada', 'Rechazada') NOT NULL,
    MODIFY `EstadoNuevo` ENUM('Ingresada', 'Aprobada', 'Rechazada') NOT NULL;

-- AlterTable
ALTER TABLE `registrovisita` MODIFY `EstadoSolicitud` ENUM('Ingresada', 'Aprobada', 'Rechazada') NOT NULL;

-- AlterTable
ALTER TABLE `solicitudvisita` MODIFY `EstadoSolicitud` ENUM('Ingresada', 'Aprobada', 'Rechazada') NOT NULL;
