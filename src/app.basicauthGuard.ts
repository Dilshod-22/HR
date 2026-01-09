import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  private readonly validUsername = 'admin';
  private readonly validPassword = 'admin123';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('Authentication kerak');
    }

    try {
      // Base64 dan decode qilish
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'utf-8',
      );
      const [username, password] = credentials.split(':');

      // Tekshirish
      if (username === this.validUsername && password === this.validPassword) {
        return true;
      }

      throw new UnauthorizedException("Username yoki parol noto'g'ri");
    } catch (error) {
      throw new UnauthorizedException('Autentifikatsiya xatosi');
    }
  }
}
