import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { userId: number };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.usersService.findById(req.user.userId);
  }
}
