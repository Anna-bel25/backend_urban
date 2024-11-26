import { Controller, Get, Post, Body, UseGuards, Patch, Param, Request, Delete, Query } from '@nestjs/common';
import { ResidentService } from './resident.service';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guards/auth/auth.guard';
import { ApproveRejectVisitDto } from './dto/approve-reject-visit.dto';

@Controller('resident')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  @Post('post')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar una nueva visita' })
  @ApiResponse({ status: 201, description: 'Visita registrada correctamente' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createResidentDto: CreateResidentDto, @Request() req) {
    const cedulaResidente = req.user.NumeroCedula;
    console.log('Cédula del residete:', cedulaResidente);
    createResidentDto.cedulaResidente = cedulaResidente;
    return this.residentService.create(createResidentDto);
  }


  @Get('all')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las solicitudes de visita de un residente' })
  @ApiResponse({ status: 200, description: 'OK', type: [ApproveRejectVisitDto] })
  findAll(@Request() req) {
    const cedulaResidente = req.user.NumeroCedula;
    return this.residentService.findAll(cedulaResidente);
  }
  

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las visitas de un residente' })
  @ApiResponse({ status: 200, description: 'OK', type: [CreateResidentDto] })
  async findOne(@Query('cedula') cedulaResidente: string, @Request() req) {
    if (!cedulaResidente) {
      cedulaResidente = req.user.NumeroCedula;
    }
    console.log('Cédula del residente:', cedulaResidente);
    return this.residentService.findOne(cedulaResidente);
  }


  @Patch('request/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprobar o rechazar una solicitud de visita' })
  @ApiResponse({ status: 200, description: 'Solicitud aprobada o rechazada correctamente' })
  approveOrRejectVisit(
    @Param('id') id: string,
    @Body() approveRejectVisitDto: ApproveRejectVisitDto,
  ) {
    return this.residentService.approveOrRejectVisit(+id, approveRejectVisitDto);
  }


  @Patch('visit/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una visita registrada' })
  @ApiResponse({ status: 200, description: 'Visita actualizada correctamente' })
  updateVisit(@Param('id') id: string, @Body() updateResidentDto: UpdateResidentDto) {
    return this.residentService.updateVisit(+id, updateResidentDto);
  }


  @Delete('visit/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una visita registrada' })
  @ApiResponse({ status: 200, description: 'Visita eliminada correctamente' })
  remove(@Param('id') id: string) {
    return this.residentService.remove(+id);
  }
}
