import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        console.log("Headers de la solicitud:", request.headers);
        const token = request.headers['authorization']?.split(' ')[1];
    
        if (!token) {
            console.log("Token no encontrado");
            return false;
        }

        try {
            request.user = this.jwtService.verify(token);
            console.log("Usuario decodificado:", request.user);
            return true;
        } catch {
            console.log("Token no válido o expirado");
            return false;
        }
    }
}
