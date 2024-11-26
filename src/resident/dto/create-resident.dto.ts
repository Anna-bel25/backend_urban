import { EstadoSolicitud, MedioIngreso } from "@prisma/client";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateResidentDto {
    @IsString()
    @IsNotEmpty()
    nombreVisitante: string;

    @IsString()
    @IsNotEmpty()
    apellidoVisitante: string;
    
    @IsString()
    @IsNotEmpty()
    cedulaResidente: string;

    @IsString()
    @IsNotEmpty()
    cedulaVisitante: string;

    @IsString()
    @IsNotEmpty()
    manzanaVilla: string;

    @IsDateString()
    @IsNotEmpty()
    fechaVisita: string;

    @IsOptional()
    @IsEnum(EstadoSolicitud)
    estadoSolicitud?: EstadoSolicitud;

    @IsEnum(MedioIngreso)
    medioIngreso: MedioIngreso;
}

