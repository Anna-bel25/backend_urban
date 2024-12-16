-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `numeroCedula` VARCHAR(191) NOT NULL,
    `rol` ENUM('Visitante', 'Residente') NOT NULL,
    `contrasena` VARCHAR(191) NULL,
    `fotoPerfil` VARCHAR(191) NULL,
    `biometria` LONGBLOB NULL,
    `manzanaVilla` VARCHAR(191) NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_numeroCedula_key`(`numeroCedula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SolicitudVisita` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `visitanteId` INTEGER NOT NULL,
    `residenteId` INTEGER NOT NULL,
    `fechaHoraVisita` DATETIME(3) NOT NULL,
    `medioIngreso` ENUM('Vehiculo', 'Caminando') NOT NULL,
    `fotoPlaca` VARCHAR(191) NULL,
    `estadoSolicitud` ENUM('Ingresada', 'Aprobada', 'Rechazada') NOT NULL DEFAULT 'Ingresada',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegistroVisita` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `visitanteId` INTEGER NOT NULL,
    `residenteId` INTEGER NOT NULL,
    `fechaHoraVisita` DATETIME(3) NOT NULL,
    `medioIngreso` ENUM('Vehiculo', 'Caminando') NOT NULL,
    `estadoVisita` ENUM('Ingresada', 'Aprobada', 'Rechazada') NOT NULL DEFAULT 'Ingresada',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistorialSolicitud` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `solicitudId` INTEGER NOT NULL,
    `estadoAnterior` ENUM('Ingresada', 'Aprobada', 'Rechazada') NOT NULL,
    `estadoNuevo` ENUM('Ingresada', 'Aprobada', 'Rechazada') NOT NULL,
    `fechaCambio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Autenticacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `metodoAutenticacion` ENUM('Tradicional', 'Biometrica') NOT NULL,
    `fechaAutenticacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SolicitudVisita` ADD CONSTRAINT `SolicitudVisita_visitanteId_fkey` FOREIGN KEY (`visitanteId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SolicitudVisita` ADD CONSTRAINT `SolicitudVisita_residenteId_fkey` FOREIGN KEY (`residenteId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroVisita` ADD CONSTRAINT `RegistroVisita_visitanteId_fkey` FOREIGN KEY (`visitanteId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroVisita` ADD CONSTRAINT `RegistroVisita_residenteId_fkey` FOREIGN KEY (`residenteId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistorialSolicitud` ADD CONSTRAINT `HistorialSolicitud_solicitudId_fkey` FOREIGN KEY (`solicitudId`) REFERENCES `SolicitudVisita`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Autenticacion` ADD CONSTRAINT `Autenticacion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
