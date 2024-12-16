import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { MetodoAutenticacion } from '@prisma/client';

export class AuthUserDto {
    @IsOptional()
    @IsString()
    @MaxLength(10)
    numeroCedula: string;

    @IsOptional()
    @IsString()
    contrasena: string;

    @IsOptional()
    @IsString()
    biometria?: string;

    @IsEnum(MetodoAutenticacion)
    metodoAutenticacion: MetodoAutenticacion; // Tradicional o Biométrica.
}
