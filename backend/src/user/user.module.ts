import { User } from '@/entities/user/user.entity';
import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from '@/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UserModule {}
