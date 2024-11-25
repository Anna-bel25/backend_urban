
import { MetodoAutenticacion } from '@prisma/client';
import { 
    IsNotEmpty,
    IsEnum,
    IsString,
    MaxLength,
} from 'class-validator';


export class AuthDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(10)
    NumeroCedula: string;

    @IsNotEmpty()
    @IsString()
    Contrasena: string;

    @IsEnum(MetodoAutenticacion)
    MetodoAutenticacion: MetodoAutenticacion;
}