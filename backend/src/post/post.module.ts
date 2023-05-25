import { Post } from '@/entities/post/post.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './post.controller';
import { PostsService } from '@/services/posts.service';
import { HttpModule } from '@nestjs/axios';
import { Comment } from '@/entities/comment/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Comment]), HttpModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
