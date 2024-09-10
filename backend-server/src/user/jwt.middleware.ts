import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const user = this.jwtService.verify(token);
        req.user = user; // Attache l'utilisateur à la requête
      } catch (err) {
        console.error('JWT verification failed:', err);
      }
    }
    next();
  }
}
