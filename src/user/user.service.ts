import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService, 
        private jwtService: JwtService
    ) {}

    async getUsers() {
        try {
            return await this.prisma.usuario.findMany();
        } catch (error) {
            throw new Error(error.message || 'Error al obtener los usuarios');
        }
    }
    
    
    async createUser(user: RegisterDto) {
        try {
            const hashedPassword = await bcrypt.hash(user.Contrasena, 10);
            const biometriaBuffer = user.Biometria ? Buffer.from(JSON.stringify(user.Biometria)) : undefined;
    
            return await this.prisma.usuario.create({
                data: {
                    Nombre: user.Nombre,
                    Apellido: user.Apellido,
                    NumeroCedula: user.NumeroCedula,
                    Contrasena: hashedPassword,
                    Rol: user.Rol,
                    ...(biometriaBuffer && { Biometria: biometriaBuffer }),
                },
            });
        } catch (error) {
            throw new Error(error.message || 'Error al crear el usuario');
        }
    }

    // Método para buscar al usuario por sus credenciales
    async findByLogin(authDto: AuthDto) {
        const user = await this.prisma.usuario.findUnique({
            where: { NumeroCedula: authDto.NumeroCedula }, // Cambia esto según tu modelo
        });

        if (user && await bcrypt.compare(authDto.Contrasena, user.Contrasena)) {
            return user;
        }

        return null; // Devuelve null si no se encuentra el usuario o las credenciales no son válidas
    }

    async login(AuthDto: AuthDto) {
        const user = await this.findByLogin(AuthDto);
        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        await this.prisma.autenticacion.create({
            data: {
                IdUsuario: user.IdUsuario,
                MetodoAutenticacion: AuthDto.MetodoAutenticacion,
                FechaAutenticacion: new Date(),
            },
        });

        const token = this._createToken(user);
        const { Nombre, Apellido, Rol } = user;

        return {
            ...token,
            Nombre,
            Apellido,
            Rol,
        };
    }

    private _createToken(user: any) {
        const payload = { id: user.IdUsuario };
        const Authorization = this.jwtService.sign(payload);
        return { expiresIn: '1h', Authorization };
    }
    
}