import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResidentService } from './resident.service';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { ApproveRejectSolicitudDto } from './dto/approve_reject-resident.dto';
import { AuthGuard } from 'src/user/guards/auth/auth.guard';

@Controller('resident')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  /** 
   * Crear un registro de visita (desde el lado del residente)
   */
  @Post('registro-visita/:numeroCedulaResidente')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un registro de visita' })
  @ApiResponse({ status: 201, description: 'Registro de visita creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  @ApiResponse({ status: 404, description: 'Residente o visitante no encontrado.' })
  async createRegistroVisita(
    @Param('numeroCedulaResidente') numeroCedulaResidente: string,
    @Body() createRegistroDto: CreateResidentDto,
  ) {
    return this.residentService.createRegistroVisita(createRegistroDto, numeroCedulaResidente);
  }

  /** 
   * Ver las solicitudes de visita y los registros de visita de un residente
   */
  @Get('solicitudes-visita/:numeroCedulaResidente')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener solicitudes y registros de visita de un residente' })
  @ApiResponse({ status: 200, description: 'Solicitudes y registros obtenidos exitosamente.' })
  @ApiResponse({ status: 404, description: 'Residente no encontrado.' })
  async getRegistrosYSolicitudes(@Param('numeroCedulaResidente') numeroCedulaResidente: string) {
    return this.residentService.getRegistrosYSolicitudes(numeroCedulaResidente);
  }
  
  /** 
   * Aprobar o rechazar una solicitud de visita
   */
  @Patch('solicitudes-visita/:id/approve-reject')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprobar o rechazar una solicitud de visita' })
  @ApiResponse({ status: 200, description: 'Solicitud aprobada o rechazada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada.' })
  async approveRejectSolicitud(
    @Param('id') id: string,
    @Body() approveRejectDto: ApproveRejectSolicitudDto,
  ) {
    return this.residentService.approveRejectSolicitud(+id, approveRejectDto);
  }

  /** 
   * Actualizar un registro de visita
   */
  @Patch('registro-visita/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un registro de visita' })
  @ApiResponse({ status: 200, description: 'Registro de visita actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Registro de visita no encontrado.' })
  async updateRegistroVisita(
    @Param('id') id: string,
    @Body() updateRegistroDto: UpdateResidentDto
  ) {
    return this.residentService.updateRegistroVisita(+id, updateRegistroDto);
  }

  /** 
   * Eliminar un registro de visita
   */
  @Delete('registro-visita/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un registro de visita' })
  @ApiResponse({ status: 200, description: 'Registro de visita eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Registro de visita no encontrado.' })
  async deleteRegistroVisita(@Param('id') id: string) {
    return this.residentService.deleteRegistroVisita(+id);
  }
}