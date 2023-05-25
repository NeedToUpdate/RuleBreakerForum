import { CreateCommentDto } from '@/dtos/comments/create-comment.dto';
import { CommentsService } from '@/services/comments.service';
import { Controller, Post, Body, Headers, Get, Param } from '@nestjs/common';
import { Comment } from '@/entities/comment/comment.entity';
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Headers('authorization') authorizationHeader: string,
  ): Promise<Comment> {
    return this.commentsService.create(createCommentDto, authorizationHeader);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.commentsService.findByPost(postId);
  }
}
