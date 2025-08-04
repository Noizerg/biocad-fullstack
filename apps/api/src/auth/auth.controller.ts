import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterDtoSwagger } from './dto/register.dto';

import { LoginDto, LoginDtoSwagger } from './dto/login.dto';
import { RefreshDto, RefreshDtoSwagger } from './dto/refresh.dto';
import type { RegisterDtoType } from './dto/register.dto';
import express from 'express';
import type { LoginDtoType } from './dto/login.dto';
import { ApiBody } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDtoSwagger })
  async register(
    @Body() body: RegisterDtoType,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    try {
      const parsed = RegisterDto.parse(body);
      const user = await this.authService.register(parsed);
      const tokens = await this.authService.generateTokens({
        userId: user.id,
        email: user.email,
      });
      this.setAuthCookies(response, tokens.accessToken, tokens.refreshToken);
      return { ok: true, user: { id: user.id, email: user.email } };
    } catch (e) {
      throw new BadRequestException(e.errors || e.message);
    }
  }

  @Post('login')
  @ApiBody({ type: LoginDtoSwagger })
  async login(
    @Body() body: LoginDtoType,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    try {
      const parsed = LoginDto.parse(body);

      const user = await this.authService.validateUser(
        parsed.email,
        parsed.password,
      );
      if (!user) throw new UnauthorizedException('Invalid credentials');

      const tokens = await this.authService.generateTokens({
        userId: user.id,
        email: user.email,
      });

      this.setAuthCookies(response, tokens.accessToken, tokens.refreshToken);

      return {
        ok: true,
        user: { id: user.id, email: user.email },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      };
    } catch (e) {
      throw new BadRequestException(e.errors || e.message);
    }
  }

  @Post('refresh')
  @ApiBody({ type: RefreshDtoSwagger })
  async refresh(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    try {
      const parsed = RefreshDto.parse(body);
      const tokens = await this.authService.refresh(parsed.refreshToken);

      this.setAuthCookies(response, tokens.accessToken, tokens.refreshToken);

      return {
        ok: true,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      };
    } catch (e) {
      throw new BadRequestException(e.errors || e.message);
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: express.Response) {
    response.clearCookie('accessToken', { path: '/' });
    response.clearCookie('refreshToken', { path: '/' });
    return { ok: true };
  }

  private setAuthCookies(
    response: express.Response,
    accessToken: string,
    refreshToken: string,
  ) {
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
}
