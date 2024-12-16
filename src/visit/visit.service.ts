import { ConflictException, Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';

@Injectable()
export class VisitService {
  constructor(private readonly prisma: PrismaService) {}


  /**
   * Crear una solicitud de visita
   */
  async createSolicitudVisita(createSolicitudDto: CreateVisitDto) {
    try {
      console.log('Datos recibidos en createSolicitudDto:', createSolicitudDto);
  
      // Convertir la fecha y hora al formato correcto
      const fechaHoraVisita = this.convertirFechaHora(createSolicitudDto.fechaHoraVisita);
  
      // Buscar al visitante y residente por sus cédulas
      const [visitante, residente] = await Promise.all([
        this.prisma.usuario.findUnique({
          where: { numeroCedula: createSolicitudDto.numeroCedulaVisitante },
        }),
        this.prisma.usuario.findUnique({
          where: { numeroCedula: createSolicitudDto.numeroCedulaResidente },
        }),
      ]);
  
      if (!visitante || !residente) {
        throw new NotFoundException('Visitante o residente no encontrado.');
      }
  
      // Validar que la manzanaVilla proporcionada sea la misma que la del residente
      if (residente.manzanaVilla !== createSolicitudDto.manzanaVilla) {
        throw new BadRequestException('La manzana y villa proporcionada no coinciden con el residente.');
      }
  
      // Verificar si ya existe una solicitud de visita con los mismos detalles
      const existingSolicitud = await this.prisma.solicitudVisita.findFirst({
        where: {
          visitanteId: visitante.id,
          residenteId: residente.id,
          fechaHoraVisita: fechaHoraVisita,
        },
      });
  
      if (existingSolicitud) {
        throw new ConflictException('Ya existe una solicitud para esta visita con los mismos datos. \nIntenta con una fecha u hora diferente.');
      }
  
      // Crear la solicitud de visita
      const solicitud = await this.prisma.solicitudVisita.create({
        data: {
          visitanteId: visitante.id,
          residenteId: residente.id,
          fechaHoraVisita: fechaHoraVisita,
          medioIngreso: createSolicitudDto.medioIngreso,
          fotoPlaca: createSolicitudDto.fotoPlaca,
        },
      });
  
      // Registrar el historial con el estado inicial ("Ingresada")
      await this.prisma.historialSolicitud.create({
        data: {
          solicitudId: solicitud.id,
          estadoAnterior: 'Ingresada',
          estadoNuevo: 'Ingresada',
        },
      });
  
      return solicitud;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear la solicitud de visita.');
    }
  }


  /**
   * Obtener todas las solicitudes ingresadas por un visitante
   */
  async getSolicitudesYRegistrosPorVisitante(numeroCedulaVisitante: string) {
    try {
      // Buscar al usuario por su cédula
      const usuario = await this.prisma.usuario.findUnique({
        where: { numeroCedula: numeroCedulaVisitante },
      });

      // Verificar si el usuario existe
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado.', 'No se encontró ningún usuario con esta cédula.');
      }
  
      // Verificar si la cédula corresponde a un residente
      if (usuario.rol === 'Residente') {
        throw new BadRequestException('La cédula corresponde a un residente, \npor lo tanto no hay registros de visita.');
      }
  
      // Si es un visitante, procedemos con la búsqueda de solicitudes y registros
      const [solicitudesVisita, registrosVisita] = await Promise.all([
        this.prisma.solicitudVisita.findMany({
          where: { visitanteId: usuario.id },
          include: {
            residente: true,
            visitante: true,
          },
        }),
        this.prisma.registroVisita.findMany({
          where: { visitanteId: usuario.id },
          include: {
            residente: true,
            visitante: true,
          },
        }),
      ]);
  
      // Si no hay solicitudes ni registros, devolvemos un mensaje indicando que no se encontraron datos
      if (solicitudesVisita.length === 0 && registrosVisita.length === 0) {
        return {
          message: 'No se encontraron solicitudes ni registros de visita para este visitante.',
          solicitudesVisita,
          registrosVisita,
        };
      }
  
      return {
        solicitudesVisita,
        registrosVisita,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener solicitudes y registros de visita.');
    }
  }
  

  /**
   * Ver todas las solicitudes clasificadas por estado del visitante
   */
  async getEstadoSolicitud(numeroCedulaVisitante: string) {
    try {
      // Buscar al visitante por su cédula
      const visitante = await this.prisma.usuario.findUnique({
        where: { numeroCedula: numeroCedulaVisitante },
      });

      if (!visitante) {
        throw new NotFoundException('Visitante no encontrado.');
      }

      // Obtener todas las solicitudes del visitante
      const solicitudes = await this.prisma.solicitudVisita.findMany({
        where: { visitanteId: visitante.id },
        include: {
          residente: true,
          visitante: true,
        },
      });

      if (solicitudes.length === 0) {
        return {
          message: 'No se encontraron solicitudes de visita para este visitante.',
          solicitudes,
        };
      }

      // Clasificar las solicitudes por estado
      const solicitudesPorEstado = solicitudes.reduce((acc, solicitud) => {
        const estado = solicitud.estadoSolicitud;
        if (!acc[estado]) {
          acc[estado] = [];
        }
        acc[estado].push(solicitud);
        return acc;
      }, {});

      // Retornar las solicitudes agrupadas por estado
      return solicitudesPorEstado;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener el estado de las solicitudes.');
    }
  }
  
  
  /**
   * Modificar una solicitud de visita
   */
  async updateSolicitudVisita(id: number, updateSolicitudDto: UpdateVisitDto) {
    try {
      console.log('Datos actualizados en updateSolicitudDto:', updateSolicitudDto);
  
      // Buscar la solicitud de visita
      const solicitud = await this.prisma.solicitudVisita.findUnique({
        where: { id },
      });
  
      if (!solicitud) {
        throw new NotFoundException('La solicitud de visita no fue encontrada.');
      }
  
      // Verificar el estado de la solicitud
      if (solicitud.estadoSolicitud === 'Aprobada' || solicitud.estadoSolicitud === 'Rechazada') {
        throw new ConflictException('No se puede modificar una solicitud con estado diferente a "Ingresada".');
      }
  
      // Verificar que si el medioIngreso es "Vehículo", la fotoPlaca esté incluida
      if (updateSolicitudDto.medioIngreso === 'Vehiculo' && !updateSolicitudDto.fotoPlaca) {
        throw new BadRequestException('La foto de la placa es requerida cuando el medio de ingreso es "Vehiculo".');
      }
  
      // Preparar los datos a actualizar
      const updatedData: any = {};
  
      if (updateSolicitudDto.medioIngreso === 'Caminando') {
        updatedData.fotoPlaca = null; // Remover la foto de la placa si el medio de ingreso es "Caminando"
      }
  
      if (updateSolicitudDto.fechaHoraVisita) {
        updatedData.fechaHoraVisita = this.convertirFechaHora(updateSolicitudDto.fechaHoraVisita);
      }
  
      if (updateSolicitudDto.medioIngreso) {
        updatedData.medioIngreso = updateSolicitudDto.medioIngreso;
      }
  
      if (updateSolicitudDto.fotoPlaca) {
        updatedData.fotoPlaca = updateSolicitudDto.fotoPlaca;
      }
  
      if (Object.keys(updatedData).length === 0) {
        throw new BadRequestException('No se proporcionaron datos válidos para actualizar.');
      }
  
      // Actualizar la solicitud de visita
      return await this.prisma.solicitudVisita.update({
        where: { id },
        data: updatedData,
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar la solicitud de visita.');
    }
  }


  /**
   * Eliminar una solicitud de visita
   */
  async deleteSolicitudVisita(id: number) {
    try {
      console.log('Datos eliminados en id:', id);

      // Buscar la solicitud de visita
      const solicitud = await this.prisma.solicitudVisita.findUnique({
        where: { id },
      });

      if (!solicitud) {
        throw new NotFoundException('La solicitud de visita no fue encontrada.');
      }

      // Eliminar el historial relacionado con la solicitud
      await this.prisma.historialSolicitud.deleteMany({
        where: { solicitudId: id },
      });

      // Eliminar la solicitud de visita
      await this.prisma.solicitudVisita.delete({
        where: { id },
      });

      return { message: 'Solicitud de visita eliminada con éxito.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar la solicitud de visita.');
    }
  }




  /**
   * Convertir la fecha y hora en formato ISO
   */
  private convertirFechaHora(fechaHora: string): Date {
    try {
      const [fecha, hora] = fechaHora.split(' ');
  
      // Validar que la fecha y hora estén en el formato correcto
      const fechaRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
      const horaRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/; // HH:MM
  
      if (!fechaRegex.test(fecha) || !horaRegex.test(hora)) {
        throw new BadRequestException('La fecha y hora deben estar en el formato "YYYY-MM-DD HH:MM".');
      }
  
      return new Date(`${fecha}T${hora}:00Z`);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al convertir la fecha y hora.');
    }
  }
}