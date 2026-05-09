import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { JwtStrategy } from './jwt/jwt.strategy';
import { Rol } from 'src/roles/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rol])],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
