import { EstadoRegistro, MedioIngreso } from "@prisma/client";
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";

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

    @IsEnum(MedioIngreso)
    medioIngreso: MedioIngreso;

    @IsEnum(EstadoRegistro)
    EstadoRegistro: EstadoRegistro;
}

