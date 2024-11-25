// import { PartialType } from '@nestjs/mapped-types';
// import { CreateVisitDto } from './create-visit.dto';

// export class UpdateVisitDto extends PartialType(CreateVisitDto) {}


import { IsDate, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoSolicitud, MedioIngreso } from '@prisma/client';

export class UpdateVisitDto {
    @IsOptional()
    @IsDateString()
    fechaVisita?: string;

    @IsOptional()
    @IsEnum(MedioIngreso)
    medioIngreso?: MedioIngreso;

    @IsOptional()
    @IsString()
    fotoPlaca?: string;

    @IsOptional()
    @IsEnum(EstadoSolicitud)
    estado?: EstadoSolicitud;
}