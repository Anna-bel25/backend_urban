-- DropForeignKey
ALTER TABLE `registrovisita` DROP FOREIGN KEY `RegistroVisita_CedulaResidente_fkey`;

-- DropForeignKey
ALTER TABLE `registrovisita` DROP FOREIGN KEY `RegistroVisita_CedulaVisitante_fkey`;

-- DropForeignKey
ALTER TABLE `solicitudvisita` DROP FOREIGN KEY `SolicitudVisita_CedulaResidente_fkey`;

-- DropForeignKey
ALTER TABLE `solicitudvisita` DROP FOREIGN KEY `SolicitudVisita_CedulaVisitante_fkey`;
