
import { RolUsuario } from '@prisma/client';
import { 
    IsEnum,
    IsNotEmpty,
    IsString,
    MaxLength,
    IsOptional,
    IsArray,
} from 'class-validator';


export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(10)
    NumeroCedula: string;

    @IsNotEmpty()
    @IsString()
    Contrasena: string;

    @IsNotEmpty()
    @IsString()
    Nombre: string;

    @IsNotEmpty()
    @IsString()
    Apellido: string;

    @IsNotEmpty()
    @IsEnum(RolUsuario)
    Rol: RolUsuario;

    @IsOptional()
    @IsArray()
    Biometria?: string[];
}
