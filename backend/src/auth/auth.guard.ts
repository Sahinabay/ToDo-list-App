import { Injectable, ExecutionContext, UnauthorizedException, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    console.log("Authguard çalıştı!");
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    console.log("🔐 Gelen Authorization Header:", authHeader); 
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Token Eksik veya Format Yanlış!'); // 🚨 Hata logu ekleyelim
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      console.log('Gelen Token:', token); 
      console.log('ENV JWT_SECRET:', process.env.JWT_SECRET);
      const decoded = this.jwtService.verify(token);
      console.log('Decoded Token:', decoded);
      request.user = decoded;
      return true;
    } catch (error) {
      console.error('Token Verification Error:', error); 
      throw new UnauthorizedException('Invalid token');
    }
  }
}
