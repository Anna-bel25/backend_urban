import { IsEnum } from 'class-validator';
import { EstadoSolicitud } from '@prisma/client';

export class ApproveRejectSolicitudDto {
    @IsEnum(EstadoSolicitud)
    estadoSolicitud: EstadoSolicitud;
}
