import { CreatePostDto } from '@/dtos/posts/create-post.dto';
import { UpdatePostDto } from '@/dtos/posts/update-post.dto';
import { PostsService } from '@/services/posts.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Headers,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { validate } from 'class-validator';
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Headers('authorization') token: string,
  ) {
    const validationErrors = await validate(createPostDto);
    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }

    return this.postsService.create(createPostDto, token);
  }
  @Get()
  findAll(@Query('page') page: number) {
    return this.postsService.findAll(page);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }
  @Patch(':id/addRule')
  async addRule(
    @Param('id') id: string,
    @Body('rule') rule: string,
    @Body('userId') userId: string,
  ) {
    return this.postsService.addRule(id, rule, userId);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
