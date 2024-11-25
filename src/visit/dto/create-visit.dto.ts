import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { MedioIngreso, EstadoSolicitud } from '@prisma/client';

export class CreateVisitDto {
    @IsString()
    @IsNotEmpty()
    nombreVisitante: string;

    @IsString()
    @IsNotEmpty()
    apellidoVisitante: string;

    @IsString()
    @IsNotEmpty()
    cedulaVisitante: string;

    @IsString()
    @IsNotEmpty()
    cedulaResidente: string;

    @IsString()
    @IsNotEmpty()
    manzanaVilla: string;

    @IsDateString()
    @IsNotEmpty()
    fechaVisita: string;

    @IsEnum(MedioIngreso)
    medioIngreso: MedioIngreso;

    @IsOptional()
    @IsEnum(EstadoSolicitud)
    estadoSolicitud?: EstadoSolicitud;

    @IsOptional()
    @IsString()
    fotoPlaca?: string;
}
