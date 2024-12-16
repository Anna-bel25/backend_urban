import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { PrismaService } from 'src/prisma.service';
import { ApproveRejectSolicitudDto } from './dto/approve_reject-resident.dto';

@Injectable()
export class ResidentService {

  constructor(private readonly prisma: PrismaService) {}


  /**
   * Crear un registro de visita (desde el lado del residente)
   */
  async createRegistroVisita(createRegistroDto: CreateResidentDto, numeroCedulaResidente: string) {
    console.log('Datos recibidos en createRegistroDto:', createRegistroDto);
  
    try {
      if (!numeroCedulaResidente) {
        throw new BadRequestException('La cédula del residente es obligatoria.');
      }
  
      // Buscar al residente por su cédula
      const residente = await this.prisma.usuario.findUnique({
        where: { numeroCedula: numeroCedulaResidente },
      });
  
      if (!residente || residente.rol !== 'Residente') {
        throw new NotFoundException('Residente no encontrado o no tiene el rol de residente.');
      }
  
      // Buscar al visitante por su cédula
      const visitante = await this.prisma.usuario.findUnique({
        where: { numeroCedula: createRegistroDto.numeroCedulaVisitante },
      });
  
      if (!visitante) {
        throw new NotFoundException('Visitante no encontrado.');
      }
  
      // Verificar si el nombre y apellido del visitante coinciden con los datos registrados
      if (visitante.nombre !== createRegistroDto.nombreVisitante || visitante.apellido !== createRegistroDto.apellidoVisitante) {
        throw new BadRequestException('El nombre y apellido del visitante no coinciden con los datos registrados para esa cédula.');
      }
  
      // Verificar que el visitante esté asociado a la manzana y villa correcta del residente
      if (residente.manzanaVilla !== createRegistroDto.manzanaVilla) {
        throw new BadRequestException('El visitante no corresponde con la manzana y villa del residente.');
      }
  
      // Convertir la fecha y hora al formato ISO
      const fechaHoraVisita = this.convertirFechaHora(createRegistroDto.fechaHoraVisita);
  
      // Verificar que la fecha de visita sea válida
      if (isNaN(fechaHoraVisita.getTime())) {
        throw new BadRequestException('La fecha y hora de la visita no son válidas.');
      }
  
      // Verificar si ya existe un registro de solicitud para ese visitante
      const registroExistente = await this.prisma.registroVisita.findFirst({
        where: {
          visitanteId: visitante.id,
          residenteId: residente.id,
          fechaHoraVisita: fechaHoraVisita,
        },
      });
  
      if (registroExistente) {
        throw new BadRequestException('Ya existe un registro de solicitud de visita para este visitante. \nPruebe con otra fecha y hora.');
      }
  
      // Crear el nuevo registro de visita
      return await this.prisma.registroVisita.create({
        data: {
          visitanteId: visitante.id,
          residenteId: residente.id,
          fechaHoraVisita: fechaHoraVisita,
          medioIngreso: createRegistroDto.medioIngreso,
          estadoVisita: 'Aprobada',
        },
      });
    } catch (error) {
      console.error('Error al crear el registro de visita:', error);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Ocurrió un error inesperado al crear el registro de visita.');
    }
  }
  

  /**
   * Ver las solicitudes de visita
   */
  async getRegistrosYSolicitudes(numeroCedulaResidente: string) {
    try {
      // Buscar al residente por su cédula
      const residente = await this.prisma.usuario.findUnique({
        where: { numeroCedula: numeroCedulaResidente },
      });
  
      if (!residente || residente.rol !== 'Residente') {
        throw new NotFoundException('Residente no encontrado.');
      }
  
      // 1. Obtener los registros de visita donde el residente ha sido visitado (residenteId)
      const registrosComoResidente = await this.prisma.registroVisita.findMany({
        where: {
          residenteId: residente.id, // El residente es quien recibe la visita
        },
        include: {
          visitante: true,
          residente: true,
        },
      });
  
      // 2. Obtener las solicitudes de visita dirigidas hacia el residente
      const solicitudesHaciaResidente = await this.prisma.solicitudVisita.findMany({
        where: {
          residenteId: residente.id, // Solicitudes donde el residente es el destinatario
        },
        include: {
          visitante: true,
          residente: true,
        },
      });
  
      return {
        registrosComoResidente,  // Registros donde el residente ha sido visitado
        solicitudesHaciaResidente,  // Solicitudes donde el residente es el destinatario
      };
    } catch (error) {
      console.error('Error al obtener registros y solicitudes de visita:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Ocurrió un error inesperado al obtener los registros y solicitudes de visita.');
    }
  }


  /**
   * Aprobar o rechazar una solicitud de visita
   */
  async approveRejectSolicitud(id: number, approveRejectDto: ApproveRejectSolicitudDto) {
    try {
      console.log('Estado actualizado en approveRejectDto:', approveRejectDto);
  
      const solicitud = await this.prisma.solicitudVisita.findUnique({
        where: { id },
      });
  
      if (!solicitud) {
        throw new NotFoundException('Solicitud de visita no encontrada.');
      }
  
      // Registrar el cambio de estado en el historial
      const historial = await this.prisma.historialSolicitud.create({
        data: {
          solicitudId: solicitud.id,
          estadoAnterior: solicitud.estadoSolicitud,
          estadoNuevo: approveRejectDto.estadoSolicitud,
        },
      });
  
      // Actualizar el estado de la solicitud
      const updatedSolicitud = await this.prisma.solicitudVisita.update({
        where: { id },
        data: {
          estadoSolicitud: approveRejectDto.estadoSolicitud,
        },
      });
  
      return {
        message: 'Registro de visita actualizado correctamente.',
        historial: historial,
        updatedSolicitud: updatedSolicitud,
      };
    } catch (error) {
      console.error('Error al aprobar o rechazar la solicitud de visita:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Ocurrió un error inesperado al aprobar o rechazar la solicitud de visita.');
    }
  }


  /**
   * Modificar un registro de visita
   */
  async updateRegistroVisita(id: number, updateRegistroDto: UpdateResidentDto) {
    try {
      console.log('Datos actualizado en updateRegistroDto:', updateRegistroDto);
      
      const registro = await this.prisma.registroVisita.findUnique({
        where: { id },
      });
  
      if (!registro) {
        throw new NotFoundException('Registro de visita no encontrado.');
      }
  
      let updatedData = {};
  
      // Actualizar los campos si son proporcionados
      if (updateRegistroDto.fechaHoraVisita) {
        const fechaHoraVisita = this.convertirFechaHora(updateRegistroDto.fechaHoraVisita);
        if (isNaN(fechaHoraVisita.getTime())) {
          throw new BadRequestException('La fecha y hora de la visita no son válidas.');
        }
        updatedData = {
          ...updatedData,
          fechaHoraVisita: fechaHoraVisita,
        };
      }
  
      if (updateRegistroDto.medioIngreso) {
        updatedData = {
          ...updatedData,
          medioIngreso: updateRegistroDto.medioIngreso,
        };
      }
  
      // Verificar que haya datos para actualizar
      if (Object.keys(updatedData).length === 0) {
        throw new BadRequestException('No se proporcionaron datos válidos para actualizar.');
      }
  
      // Actualizar el registro de visita
      const updatedRegistro = await this.prisma.registroVisita.update({
        where: { id },
        data: updatedData,
      });
  
      return {
        message: 'Registro de visita actualizado correctamente.',
        updatedRegistro: updatedRegistro,
      };
    } catch (error) {
      console.error('Error al actualizar el registro de visita:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Ocurrió un error inesperado al actualizar el registro de visita.');
    }
  }


  /**
   * Eliminar un registro de visita
   */
  async deleteRegistroVisita(id: number) {
    try {
      console.log('Datos eliminados en id:', id);
      
      const registro = await this.prisma.registroVisita.findUnique({
        where: { id },
      });
  
      if (!registro) {
        throw new NotFoundException('Registro de visita no encontrado.');
      }
  
      await this.prisma.registroVisita.delete({
        where: { id },
      });
  
      return { message: 'Registro de visita eliminado con éxito.' };
    } catch (error) {
      console.error('Error al eliminar el registro de visita:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Ocurrió un error inesperado al eliminar el registro de visita.');
    }
  }



  
  
  /**
   * Convertir la fecha y hora al formato ISO
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