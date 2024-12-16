import { ConflictException, Injectable, UnauthorizedException, HttpStatus, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Obtener todos los usuarios
   */
  async getUsers() {
    try {
      return await this.prisma.usuario.findMany();
    } catch (error) {
      throw new Error(error.message || 'Error al obtener los usuarios');
    }
  }

  /**
   * Crear un nuevo usuario
   */
  async createUsuario(createUserDto: CreateUserDto) {
    try {
      console.log('Datos recibidos en createUsuario:', createUserDto);
      // Verificar si ya existe un usuario con el mismo número de cédula
      const existingUser = await this.prisma.usuario.findUnique({
        where: {
          numeroCedula: createUserDto.numeroCedula,
        },
      });
  
      if (existingUser) {
        throw new ConflictException('El número de cédula ya está registrado.');
      }
  
      // Validar que manzanaVilla esté presente si el rol es "Residente"
      if (createUserDto.rol === 'Residente' && !createUserDto.manzanaVilla) {
        throw new BadRequestException('Los residentes deben proporcionar manzana y villa.');
      }
  
      // Si la foto de perfil está presente
      // let fotoPerfilBuffer: Buffer | null = null;
      // if (createUserDto.fotoPerfil) {
      //   fotoPerfilBuffer = await this.handleBase64Image(createUserDto.fotoPerfil, 'fotoPerfil');
      // }
  
      // Si la biometría está presente
      let biometriaBuffer: Buffer | null = null;
      if (createUserDto.biometria) {
        biometriaBuffer = await this.handleBase64Image(createUserDto.biometria, 'biometria');
      }
  
      // Hashear la contraseña si está presente
      const hashedPassword = createUserDto.contrasena ? await bcrypt.hash(createUserDto.contrasena, 10) : null;
  
      // Crear el usuario en la base de datos
      return await this.prisma.usuario.create({
        data: {
          nombre: createUserDto.nombre,
          apellido: createUserDto.apellido,
          numeroCedula: createUserDto.numeroCedula,
          rol: createUserDto.rol,
          contrasena: hashedPassword,
          //fotoPerfil: fotoPerfilBuffer,
          biometria: biometriaBuffer,
          manzanaVilla: createUserDto.manzanaVilla,
        },
      });
    } catch (error) {
      throw new Error(error.message || 'Error al crear el usuario');
    }
  }
  

  /**
   * Iniciar sesión
   */
  async login(authUserDto: AuthUserDto) {
    try {
      console.log("Datos recibidos para iniciar sesión:", authUserDto);
      let user;
      // Verificar si el método de autenticación es biométrico
      if (authUserDto.metodoAutenticacion === 'Biometrica') {
        if (!authUserDto.biometria) {
          throw new BadRequestException('El token biométrico es obligatorio.');
        }
  
        // Convertir la biometría a un tipo de dato adecuado para la comparación
        const biometriaBuffer = Buffer.from(authUserDto.biometria, 'base64');
  
        // Buscar el usuario con el token biométrico (sin hash)
        user = await this.prisma.usuario.findFirst({
          where: {
            biometria: biometriaBuffer,
          },
        });
  
        if (!user) {
          throw new UnauthorizedException('Credenciales biométricas inválidas.');
        }
      } else {
        // Autenticación tradicional
        user = await this.prisma.usuario.findUnique({
          where: { numeroCedula: authUserDto.numeroCedula },
        });
  
        if (!user) {
          throw new UnauthorizedException('Credenciales inválidas.');
        }
  
        const isPasswordValid = await bcrypt.compare(authUserDto.contrasena, user.contrasena || '');
        if (!isPasswordValid) {
          throw new UnauthorizedException('Credenciales inválidas.');
        }
      }
  
      // Registrar el intento de autenticación
      await this.prisma.autenticacion.create({
        data: {
          usuarioId: user.id,
          metodoAutenticacion: authUserDto.metodoAutenticacion,
          fechaAutenticacion: new Date(),
        },
      });
  
      // Generar y devolver el token JWT
      const token = this._createToken(user);
      const { nombre, apellido, rol, manzanaVilla } = user;
  
      const response = {
        token,
        expiresIn: '1h',
        nombre,
        apellido,
        rol,
        manzanaVilla,
        numeroCedula: user.numeroCedula,
      };
  
      console.log("Respuesta enviada al cliente:", response);
  
      return response;
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }




  /**
   * Crear token JWT
   */
  private _createToken(user: any): string {
    const payload = {
      id: user.id,
      numeroCedula: user.numeroCedula,
    };
    return this.jwtService.sign(payload);
  }

    

  // Función para manejar imágenes en base64
  async handleBase64Image(base64String: string, filenamePrefix: string): Promise<Buffer | null> {
    if (!base64String) {
      return null;
    }

    // Eliminar el prefijo de base64 (si existe) y obtener solo la parte codificada
    const base64Data = base64String.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const filePath = path.join(__dirname, `../uploads/${filenamePrefix}_${Date.now()}.png`);
    await fs.promises.writeFile(filePath, buffer);

    return buffer;
  }
}