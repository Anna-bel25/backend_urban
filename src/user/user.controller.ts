import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Crear un nuevo usuario
   */
  @Post('register')
  @ApiOperation({ summary: 'Crear usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente.' })
  @ApiResponse({ status: 409, description: 'Número de cédula ya registrado.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  async createUsuario(@Body() createUsuarioDto: CreateUserDto) {
    return this.userService.createUsuario(createUsuarioDto);
  }

  /**
   * Inicio de sesión
   */
  @Post('login')
  @ApiOperation({ summary: 'Inicio de sesión' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  login(@Body() authDto: AuthUserDto) {
    return this.userService.login(authDto);
  }

  /**
   * Obtener todos los usuarios
   */
  @Get('users')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida.' })
  @ApiResponse({ status: 403, description: 'Acceso no autorizado.' })
  async getUsers() {
    return this.userService.getUsers();
  }
}
