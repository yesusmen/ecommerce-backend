import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3310,
      username: 'root',
      password: 'ya123456789',
      database: 'ecommerce_db',
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret, // Cambia esto por una clave secreta segura
      signOptions: { expiresIn: '1h' }, // Opcional: establece un tiempo de expiración para el token
    }),
    RolesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
