// import { PartialType } from '@nestjs/mapped-types';
// import { CreateResidentDto } from './create-resident.dto';

// export class UpdateResidentDto extends PartialType(CreateResidentDto) {}

import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { MedioIngreso } from '@prisma/client';

export class UpdateResidentDto {
    @IsOptional()
    @IsDateString()
    fechaVisita?: string;

    @IsOptional()
    @IsEnum(MedioIngreso)
    medioIngreso?: MedioIngreso;
}
