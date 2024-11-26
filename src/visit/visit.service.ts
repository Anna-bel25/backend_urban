import { Injectable } from '@nestjs/common';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { PrismaService } from 'src/prisma.service';
import { EstadoSolicitud, RolUsuario } from '@prisma/client';


@Injectable()
export class VisitService {
  constructor(private prisma: PrismaService) {}

  
  async create(createVisitDto: CreateVisitDto) {
    try {

      const { nombreVisitante, apellidoVisitante, cedulaVisitante, cedulaResidente, manzanaVilla, fechaVisita, estadoSolicitud, medioIngreso, fotoPlaca } = createVisitDto;
      const estado = estadoSolicitud || EstadoSolicitud.Ingresada;
  
      const solicitud = await this.prisma.solicitudVisita.create({
        data: {
          NombreVisitante: nombreVisitante,
          ApellidoVisitante: apellidoVisitante,
          CedulaVisitante: cedulaVisitante,
          CedulaResidente: cedulaResidente,
          ManzanaVilla: manzanaVilla,
          FechaVisita: new Date(fechaVisita),
          MedioIngreso: medioIngreso,
          EstadoSolicitud: estado,
          FotoPlaca: fotoPlaca || null,
        },
      });
  
      return solicitud;
    } catch (error) {
      console.error('Error al crear la solicitud de visita:', error);
      throw new Error('Hubo un error al crear la solicitud de visita: ' + error.message);
    }
  }
  

  async findAll(cedulaVisitante: string) {
    try {
      if (!cedulaVisitante) {
        throw new Error('La cédula del visitante es requerida');
      }
  
      const solicitudes = await this.prisma.solicitudVisita.findMany({
        where: { CedulaVisitante: cedulaVisitante },
      });
  
      if (!solicitudes || solicitudes.length === 0) {
        return { message: 'No se encontraron solicitudes para este visitante' };
      }
  
      return solicitudes;
    } catch (error) {
      console.error('Error al obtener las solicitudes de visita:', error);
      throw new Error('Error al obtener solicitudes de visita: ' + error.message);
    }
  }
  
  
  


  // async findUserByCedula(cedula: string) {
  //   try {
  //       if (!cedula) {
  //           throw new Error('La cédula no puede estar vacía');
  //       }

  //       return await this.prisma.usuario.findUnique({
  //           where: { NumeroCedula: cedula },
  //       });
  //   } catch (error) {
  //       throw new Error('Error al buscar el usuario: ' + error.message);
  //   }
  // }


  // async findAll(cedulaVisitante: string) {
  //   try {
  //     const solicitudes = await this.prisma.solicitudVisita.findMany({
  //       where: { CedulaVisitante: cedulaVisitante },
  //     });
  
  //     if (!solicitudes.length) {
  //       throw new Error('No se encontraron solicitudes para el visitante');
  //     }
  
  //     return solicitudes;
  //   } catch (error) {
  //     console.error('Error al obtener las solicitudes de visita:', error);
  //     throw new Error('Hubo un error al obtener las solicitudes de visita' + error.message);
  //   }
  // }


  async findOne(id: number) {
    try {
      const solicitud = await this.prisma.solicitudVisita.findUnique({
        where: { IdSolicitud: id },
      });

      if (!solicitud) {
        throw new Error(`Solicitud de visita con ID ${id} no encontrada`);
      }

      return solicitud;
    } catch (error) {
      console.error('Error al obtener la solicitud de visita:', error);
      throw new Error(`Hubo un error al obtener la solicitud de visita con ID ${id}`);
    }
  }


  async update(id: number, updateVisitDto: UpdateVisitDto) {
    try {
      const { fechaVisita, medioIngreso, fotoPlaca } = updateVisitDto;

      const solicitud = await this.prisma.solicitudVisita.update({
        where: { IdSolicitud: id },
        data: {
          FechaVisita: fechaVisita ? new Date(fechaVisita) : undefined,
          MedioIngreso: medioIngreso || undefined,
          FotoPlaca: fotoPlaca || undefined,
        },
      });

      return solicitud;
    } catch (error) {
      console.error('Error al actualizar la solicitud de visita:', error);
      throw new Error(`Hubo un error al actualizar la solicitud de visita con ID ${id}`);
    }
  }


  async remove(id: number) {
    try {
      const solicitud = await this.prisma.solicitudVisita.delete({
        where: { IdSolicitud: id },
      });

      return solicitud;
    } catch (error) {
      console.error('Error al eliminar la solicitud de visita:', error);
      throw new Error(`Hubo un error al eliminar la solicitud de visita con ID ${id}`);
    }
  }

}
