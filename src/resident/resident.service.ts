import { Injectable } from '@nestjs/common';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { PrismaService } from 'src/prisma.service';
import { EstadoRegistro, EstadoSolicitud } from '@prisma/client';
import { ApproveRejectVisitDto } from './dto/approve-reject-visit.dto';

@Injectable()
export class ResidentService {
  constructor(private prisma: PrismaService) {}

  async create(createResidentDto: CreateResidentDto) {
    try {
      const { nombreVisitante, apellidoVisitante, cedulaResidente, cedulaVisitante, manzanaVilla, fechaVisita, medioIngreso } = createResidentDto;

      const registro = await this.prisma.registroVisita.create({
        data: {
          NombreVisitante: nombreVisitante,
          ApellidoVisitante: apellidoVisitante,
          CedulaResidente: cedulaResidente,
          CedulaVisitante: cedulaVisitante,
          ManzanaVilla: manzanaVilla,
          FechaVisita: new Date(fechaVisita),
          MedioIngreso: medioIngreso,
          EstadoRegistro: EstadoRegistro.Registrada,
        },
      });

      return registro;
    } catch (error) {
      console.error('Error al registrar la visita:', error);
      throw new Error('Error al registrar la visita: ' + error.message);
    }
  }

  
  async findAllVisits(cedulaResidente: string) {
    try {
      const visitas = await this.prisma.registroVisita.findMany({
        where: { CedulaResidente: cedulaResidente },
      });
  
      if (!visitas.length) {
        throw new Error('No se encontraron visitas para el residente');
      }
  
      return visitas;
    } catch (error) {
      console.error('Error al obtener las visitas:', error);
      throw new Error('Error al obtener las visitas: ' + error.message);
    }
  }

  
  async findAllRequests(cedulaResidente: string) {
    try {
      const solicitudes = await this.prisma.solicitudVisita.findMany({
        where: { CedulaResidente: cedulaResidente },
      });
  
      if (!solicitudes.length) {
        throw new Error('No se encontraron solicitudes de visita para el residente');
      }
  
      return solicitudes;
    } catch (error) {
      console.error('Error al obtener las solicitudes de visita:', error);
      throw new Error('Error al obtener las solicitudes de visita: ' + error.message);
    }
  }

  
  async approveOrRejectVisit(idSolicitud: number, approveRejectVisitDto: ApproveRejectVisitDto) {
    try {
      const { estado } = approveRejectVisitDto;

      const solicitud = await this.prisma.solicitudVisita.update({
        where: { IdSolicitud: idSolicitud },
        data: { EstadoSolicitud: estado },
      });

      if (estado === EstadoSolicitud.Aceptada) {
        return await this.prisma.registroVisita.create({
          data: {
            NombreVisitante: solicitud.NombreVisitante,
            ApellidoVisitante: solicitud.ApellidoVisitante,
            CedulaResidente: solicitud.CedulaResidente,
            CedulaVisitante: solicitud.CedulaVisitante,
            ManzanaVilla: solicitud.ManzanaVilla,
            FechaVisita: solicitud.FechaVisita,
            MedioIngreso: solicitud.MedioIngreso,
            EstadoRegistro: EstadoRegistro.Completada, 
          },
        });
      }

      return solicitud;
    } catch (error) {
      console.error('Error al aprobar o rechazar la solicitud:', error);
      throw new Error('Error al aprobar o rechazar la solicitud: ' + error.message);
    }
  }

  
  async updateVisit(id: number, updateResidentDto: UpdateResidentDto) {
    try {
      const { fechaVisita, medioIngreso } = updateResidentDto;

      return await this.prisma.registroVisita.update({
        where: { IdRegistro: id },
        data: {
          FechaVisita: fechaVisita ? new Date(fechaVisita) : undefined,
          MedioIngreso: medioIngreso || undefined,
        },
      });
    } catch (error) {
      throw new Error('Error al actualizar la visita: ' + error.message);
    }
  }


  async remove(id: number) {
    try {
      return await this.prisma.registroVisita.delete({
        where: { IdRegistro: id },
      });
    } catch (error) {
      throw new Error('Error al eliminar la visita: ' + error.message);
    }
  }
  
}
