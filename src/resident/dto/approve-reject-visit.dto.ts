
import { IsEnum } from 'class-validator';
import { EstadoSolicitud } from '@prisma/client';

export class ApproveRejectVisitDto {
    @IsEnum(EstadoSolicitud)
    estado: EstadoSolicitud;
}
