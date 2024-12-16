import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VisitService } from './visit.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { AuthGuard } from 'src/user/guards/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';

@Controller('visit')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  /** 
   * Crear una solicitud de visita
   */
  @Post('solicitudes')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una solicitud de visita' })
  @ApiResponse({ status: 201, description: 'Solicitud de visita creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  @UseInterceptors(
    FileInterceptor('fotoPlaca', {
      storage: diskStorage({
        destination: './uploads/fotos',
        filename: (req, file, callback) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async createSolicitud(
    @Body() createSolicitudDto: CreateVisitDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createSolicitudDto.fotoPlaca = `/uploads/fotos/${file.filename}`;
    }

    return this.visitService.createSolicitudVisita(createSolicitudDto);
  }
  // @Post('solicitudes')
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Crear una solicitud de visita' })
  // @ApiResponse({ status: 201, description: 'Solicitud de visita creada exitosamente.' })
  // @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  // async createSolicitud(@Body() createSolicitudDto: CreateVisitDto) {
  //   return this.visitService.createSolicitudVisita(createSolicitudDto);
  // }

  /** 
   * Ver las solicitudes de visita
   */
  @Get('solicitudes-registros/:numeroCedulaVisitante')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las solicitudes de visita y registros de un visitante' })
  @ApiResponse({ status: 200, description: 'Solicitudes y registros obtenidos exitosamente.' })
  @ApiResponse({ status: 404, description: 'Visitante no encontrado.' })
  async getSolicitudesYRegistros(
    @Param('numeroCedulaVisitante') numeroCedulaVisitante: string
  ) {
    return this.visitService.getSolicitudesYRegistrosPorVisitante(numeroCedulaVisitante);
  }

  /** 
   * Ver el estado de una solicitud de visita
   */
  @Get('solicitudes/:numeroCedulaVisitante/:numeroCedulaResidente')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener el estado de las solicitudes de visita, agrupadas por estado' })
  @ApiResponse({ status: 200, description: 'Solicitudes agrupadas por estado obtenidas exitosamente.' })
  @ApiResponse({ status: 404, description: 'Solicitudes no encontradas.' })
  async getEstadoSolicitud(
    @Param('numeroCedulaVisitante') numeroCedulaVisitante: string,
  ) {
    return this.visitService.getEstadoSolicitud(numeroCedulaVisitante);
  }

  /** 
   * Actualizar una solicitud de visita
   */
  @Patch('solicitudes/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una solicitud de visita (solo las de estado "Ingresada")' })
  @ApiResponse({ status: 200, description: 'Solicitud de visita actualizada exitosamente.' })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada.' })
  @ApiResponse({ status: 409, description: 'No se puede modificar una solicitud con estado diferente a "Ingresada".' })
  @UseInterceptors(
    FileInterceptor('fotoPlaca', {
      storage: diskStorage({
        destination: './uploads/fotos',
        filename: (req, file, callback) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async updateSolicitud(
    @Param('id') id: string, 
    @Body() updateSolicitudDto: UpdateVisitDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      throw new BadRequestException('El ID proporcionado no es válido.');
    }
    if (file) {
      updateSolicitudDto.fotoPlaca = `/uploads/fotos/${file.filename}`;
    }
  
    return this.visitService.updateSolicitudVisita(idNumber, updateSolicitudDto);
  }

  // async updateSolicitud(
  //   @Param('id') id: string, 
  //   @Body() updateSolicitudDto: UpdateVisitDto
  // ) {
  //   const idNumber = parseInt(id, 10);
  //   if (isNaN(idNumber)) {
  //     throw new BadRequestException('El ID proporcionado no es válido.');
  //   }
  //   return this.visitService.updateSolicitudVisita(idNumber, updateSolicitudDto);
  // }

  /** 
   * Eliminar una solicitud de visita
   */
  @Delete('solicitudes/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una solicitud de visita' })
  @ApiResponse({ status: 200, description: 'Solicitud de visita eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada.' })
  async deleteSolicitud(@Param('id') id: string) {
    return this.visitService.deleteSolicitudVisita(+id);
  }
}