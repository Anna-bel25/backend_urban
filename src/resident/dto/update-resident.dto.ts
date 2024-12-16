import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { MedioIngreso } from '@prisma/client';

export class UpdateResidentDto {
    @IsOptional()
    @IsDateString()
    fechaHoraVisita?: string;

    @IsOptional()
    @IsEnum(MedioIngreso)
    medioIngreso?: MedioIngreso;
}
