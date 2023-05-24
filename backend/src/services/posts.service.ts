import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, MongoRepository } from 'typeorm';
import { Post } from '@/entities/post/post.entity';
import { CreatePostDto } from '@/dtos/posts/create-post.dto';
import { UpdatePostDto } from '@/dtos/posts/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: MongoRepository<Post>,
  ) {}

  create(createPostDto: CreatePostDto) {
    const post = this.postsRepository.create(createPostDto);
    return this.postsRepository.save(post);
  }

  findAll(take = 10, skip = 0) {
    return this.postsRepository.find({ take, skip, relations: ['comments'] });
  }

  findOne(id: string) {
    return this.postsRepository.findOne({
      where: { id: new ObjectId(id) },
      relations: ['comments'],
    });
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postsRepository.update(id, updatePostDto);
  }

  remove(id: string) {
    return this.postsRepository.delete(id);
  }
}
