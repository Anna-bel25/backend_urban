import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { VisitService } from './visit.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guards/auth/auth.guard';


@Controller('visit')
export class VisitController {

  constructor(private readonly visitService: VisitService) {}

  @Post('post')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar una nueva solicitud de visita' })
  @ApiResponse({ status: 201, description: 'Solicitud de visita creada correctamente' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createVisitDto: CreateVisitDto, @Request() req) {
    const cedulaVisitante = req.user.NumeroCedula; 
    createVisitDto.cedulaVisitante = cedulaVisitante;
    //return this.visitService.create(createVisitDto);
    try {
      const result = this.visitService.create(createVisitDto);
      return result;
    } catch (error) {
      console.error('Error al crear la solicitud de visita:', error);
      throw new Error('Hubo un error al crear la solicitud de visita');
    }
  }


  @Get('all')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las solicitudes de visita de un visitante' })
  @ApiResponse({ status: 200, description: 'OK', type: [CreateVisitDto] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll(@Request() req) {
    const cedulaVisitante = req.user.NumeroCedula; 
    return this.visitService.findAll(cedulaVisitante);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener una solicitud de visita por ID' })
  @ApiResponse({ status: 200, description: 'OK', type: CreateVisitDto })
  @ApiResponse({ status: 404, description: 'Solicitud de visita no encontrada' })
  findOne(@Param('id') id: string) {
    return this.visitService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una solicitud de visita' })
  @ApiResponse({ status: 200, description: 'Solicitud de visita actualizada correctamente' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  update(@Param('id') id: string, @Body() updateVisitDto: UpdateVisitDto) {
    return this.visitService.update(+id, updateVisitDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una solicitud de visita' })
  @ApiResponse({ status: 200, description: 'Solicitud de visita eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'Solicitud de visita no encontrada' })
  remove(@Param('id') id: string) {
    return this.visitService.remove(+id);
  }
}
