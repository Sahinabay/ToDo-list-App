import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthGuard} from './auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module ({
  imports:[
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync(
      {
      imports:[ConfigModule],
      inject: [ConfigService],
      useFactory:(ConfigService:ConfigService) =>({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '3600s'},
      })  ,
      
    }),
  ],
  providers:[AuthService,JwtStrategy],
  controllers:[AuthController],
  exports: [AuthService,JwtStrategy,PassportModule, JwtModule],
})
export class AuthModule{}
