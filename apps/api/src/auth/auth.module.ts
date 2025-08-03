import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from 'src/shared/shared.module';

@Module({
    imports: [PrismaModule, JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '15m' },
    }),SharedModule],
  providers: [AuthService],
  controllers: [AuthController],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
