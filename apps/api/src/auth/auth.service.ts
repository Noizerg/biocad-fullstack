import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDtoType } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDtoType) {
    // Проверяем — нет ли пользователя с таким email
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('User already exists');

    // Хешируем пароль
    const hash = await bcrypt.hash(data.password, 10);

    // Сохраняем пользователя
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
    return user;
  }

  async validateUser(email: string, password: string) {
  const user = await this.prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;
  return user;
}

 async generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      // Раскодировать токен и проверить
      const payload = this.jwtService.verify(refreshToken);
      // Тут можно добавить проверку в Redis, если хочешь (например, токен не заблокирован)
      // Можно также выдать новый refreshToken, если нужно ротацию

      // Новый access токен:
      const accessToken = this.jwtService.sign(
        { userId: payload.userId, email: payload.email },
        { expiresIn: '15m' }
      );
      // Вернуть новый access токен (и, если хочешь, новый refreshToken)
      return { accessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

}
