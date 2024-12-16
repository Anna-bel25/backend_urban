import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { RolUsuario } from '@prisma/client';

export class CreateUserDto {
    @IsString()
    @MaxLength(50)
    nombre: string;

    @IsString()
    @MaxLength(50)
    apellido: string;

    @IsString()
    @MaxLength(10)
    numeroCedula: string;

    @IsEnum(RolUsuario)
    rol: RolUsuario;

    @IsOptional()
    @IsString()
    contrasena?: string;

    @IsOptional()
    @IsString()
    fotoPerfil?: string;

    @IsOptional()
    @IsString()
    biometria?: string;

    @IsOptional()
    @IsString()
    manzanaVilla?: string; // Obligatorio solo para residentes.
}