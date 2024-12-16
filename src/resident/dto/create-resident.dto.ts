import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MedioIngreso } from '@prisma/client';

export class CreateResidentDto {
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
    manzanaVilla: string;

    @IsDateString()
    fechaHoraVisita: string;

    @IsEnum(MedioIngreso)
    medioIngreso: MedioIngreso;
}
