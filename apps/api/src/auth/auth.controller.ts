import { Controller, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterDtoSwagger } from './dto/register.dto';

import { LoginDto, LoginDtoSwagger } from './dto/login.dto';
import { RefreshDto, RefreshDtoSwagger } from './dto/refresh.dto';
import type {RegisterDtoType} from './dto/register.dto';

import type { LoginDtoType } from './dto/login.dto';
import { ApiBody } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
   @ApiBody({ type: RegisterDtoSwagger })
  async register(@Body() body:RegisterDtoType) {
    try {
      const parsed = RegisterDto.parse(body);
      return await this.authService.register(parsed);
    } catch (e) {
      // Zod ошибки — массив .errors, остальные — .message
      throw new BadRequestException(e.errors || e.message);
    }
  }

@Post('login')
  @ApiBody({ type: LoginDtoSwagger })
async login(@Body() body: LoginDtoType) {
  try {
    const parsed = LoginDto.parse(body);

    const user = await this.authService.validateUser(parsed.email, parsed.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.authService.generateTokens({
      userId: user.id,
      email: user.email,
    });

    return tokens;
  } catch (e) {
    throw new BadRequestException(e.errors || e.message);
  }
}
@Post('refresh')
@ApiBody({ type: RefreshDtoSwagger })
async refresh(@Body() body: unknown) {
  try {
    const parsed = RefreshDto.parse(body);
    return await this.authService.refresh(parsed.refreshToken);
  } catch (e) {
    throw new BadRequestException(e.errors || e.message);
  }
}

}
