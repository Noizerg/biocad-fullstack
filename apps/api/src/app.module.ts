import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [UsersModule, AuthModule, CacheModule.register({
      ttl: 60,
      max: 100, 
    }),],
  controllers: [AppController],
  providers: [AppService],
  exports: [CacheModule],
})
export class AppModule {}
