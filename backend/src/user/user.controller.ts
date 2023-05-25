import { UsersService } from '@/services/user.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }
}
