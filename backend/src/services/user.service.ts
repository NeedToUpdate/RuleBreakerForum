import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from '@/entities/user/user.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: MongoRepository<User>,
  ) {}

  async getUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
