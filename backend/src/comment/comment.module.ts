import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@/entities/comment/comment.entity';
import { HttpModule } from '@nestjs/axios';
import { Post } from '@/entities/post/post.entity';
import { CommentsService } from '@/services/comments.service';
import { CommentsController } from './comment.controller';
import { Gpt3Service } from '@/services/gpt3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post]), HttpModule],
  providers: [CommentsService, Gpt3Service],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
