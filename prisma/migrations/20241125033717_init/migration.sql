-- CreateTable
CREATE TABLE `Usuario` (
    `IdUsuario` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,
    `Apellido` VARCHAR(191) NOT NULL,
    `NumeroCedula` VARCHAR(191) NOT NULL,
    `Rol` ENUM('Visitante', 'Residente') NOT NULL,
    `Contrasena` VARCHAR(191) NULL,
    `FotoPerfil` VARCHAR(191) NULL,
    `Biometria` LONGBLOB NULL,
    `FechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `FechaActualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_NumeroCedula_key`(`NumeroCedula`),
    PRIMARY KEY (`IdUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SolicitudVisita` (
    `IdSolicitud` INTEGER NOT NULL AUTO_INCREMENT,
    `NombreVisitante` VARCHAR(191) NOT NULL,
    `ApellidoVisitante` VARCHAR(191) NOT NULL,
    `CedulaVisitante` VARCHAR(191) NOT NULL,
    `CedulaResidente` VARCHAR(191) NOT NULL,
    `ManzanaVilla` VARCHAR(191) NOT NULL,
    `FechaVisita` DATETIME(3) NOT NULL,
    `MedioIngreso` ENUM('Vehiculo', 'Caminando') NOT NULL,
    `FotoPlaca` VARCHAR(191) NULL,
    `EstadoSolicitud` ENUM('Ingresada', 'Aceptada', 'Rechazada') NOT NULL,
    `FechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `FechaActualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`IdSolicitud`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegistroVisita` (
    `IdRegistro` INTEGER NOT NULL AUTO_INCREMENT,
    `NombreVisitante` VARCHAR(191) NOT NULL,
    `ApellidoVisitante` VARCHAR(191) NOT NULL,
    `CedulaResidente` VARCHAR(191) NOT NULL,
    `CedulaVisitante` VARCHAR(191) NOT NULL,
    `ManzanaVilla` VARCHAR(191) NOT NULL,
    `FechaVisita` DATETIME(3) NOT NULL,
    `MedioIngreso` ENUM('Vehiculo', 'Caminando') NOT NULL,
    `EstadoRegistro` ENUM('Registrada', 'Completada', 'Cancelada') NOT NULL,
    `FechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `FechaActualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`IdRegistro`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistorialSolicitud` (
    `IdHistorial` INTEGER NOT NULL AUTO_INCREMENT,
    `IdSolicitud` INTEGER NOT NULL,
    `EstadoAnterior` ENUM('Ingresada', 'Aceptada', 'Rechazada') NOT NULL,
    `EstadoNuevo` ENUM('Ingresada', 'Aceptada', 'Rechazada') NOT NULL,
    `FechaCambio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`IdHistorial`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Autenticacion` (
    `IdAutenticacion` INTEGER NOT NULL AUTO_INCREMENT,
    `IdUsuario` INTEGER NOT NULL,
    `MetodoAutenticacion` ENUM('Tradicional', 'Biometrica') NOT NULL,
    `FechaAutenticacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`IdAutenticacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SolicitudVisita` ADD CONSTRAINT `SolicitudVisita_CedulaVisitante_fkey` FOREIGN KEY (`CedulaVisitante`) REFERENCES `Usuario`(`NumeroCedula`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SolicitudVisita` ADD CONSTRAINT `SolicitudVisita_CedulaResidente_fkey` FOREIGN KEY (`CedulaResidente`) REFERENCES `Usuario`(`NumeroCedula`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroVisita` ADD CONSTRAINT `RegistroVisita_CedulaResidente_fkey` FOREIGN KEY (`CedulaResidente`) REFERENCES `Usuario`(`NumeroCedula`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroVisita` ADD CONSTRAINT `RegistroVisita_CedulaVisitante_fkey` FOREIGN KEY (`CedulaVisitante`) REFERENCES `Usuario`(`NumeroCedula`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistorialSolicitud` ADD CONSTRAINT `HistorialSolicitud_IdSolicitud_fkey` FOREIGN KEY (`IdSolicitud`) REFERENCES `SolicitudVisita`(`IdSolicitud`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Autenticacion` ADD CONSTRAINT `Autenticacion_IdUsuario_fkey` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario`(`IdUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
