import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll() {
    const cached = await this.cacheManager.get('users');
    if (cached) {
      return cached;
    }

    const users = this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
    await this.cacheManager.set('users', users, 300);

    return users;
  }

  async findByEmail(email: string) {
    const cacheKey = `user:email:${email}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const user = this.prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      await this.cacheManager.set(cacheKey, user, 60 * 5);
    }
    return user;
  }

  async findById(id: number) {
    const cacheKey = `user:id:${id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const user = this.prisma.user.findUnique({
      where: { id },
    });

    if (user) {
      await this.cacheManager.set(cacheKey, user, 60 * 5);
    }

    return user;
  }
}
