import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MedioIngreso } from '@prisma/client';

export class CreateVisitDto {
    @IsString()
    @IsNotEmpty()
    nombreVisitante: string;

    @IsString()
    @IsNotEmpty()
    apellidoVisitante: string;

    @IsString()
    @IsNotEmpty()
    numeroCedulaVisitante: string;

    @IsString()
    @IsNotEmpty()
    numeroCedulaResidente: string;

    @IsString()
    @IsNotEmpty()
    manzanaVilla: string; // Manzana y Villa del residente

    @IsDateString()
    fechaHoraVisita: string;

    @IsEnum(MedioIngreso)
    medioIngreso: MedioIngreso;  // Vehículo o Caminando

    @IsOptional()
    @IsString()
    fotoPlaca?: string; // Solo si el medio de ingreso es vehículo
}
