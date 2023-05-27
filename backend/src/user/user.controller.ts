import { User } from '@/entities/user/user.entity';
import { UsersService } from '@/services/user.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userData: Partial<User>) {
    try {
      return await this.usersService.updateUser(id, userData);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
