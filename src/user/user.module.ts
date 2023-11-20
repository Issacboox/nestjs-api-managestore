import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity'
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptor/current-user.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, CurrentUserInterceptor]
})
export class UserModule {}
