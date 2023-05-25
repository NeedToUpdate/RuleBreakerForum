import { CreateCommentDto } from '@/dtos/comments/create-comment.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { MongoRepository } from 'typeorm';
import { Comment } from '@/entities/comment/comment.entity';
import { Post } from '@/entities/post/post.entity';
import { ObjectId } from 'mongodb';
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: MongoRepository<Comment>,
    @InjectRepository(Post)
    private postsRepository: MongoRepository<Post>,
    private readonly httpService: HttpService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    authorizationHeader: string,
  ): Promise<Comment> {
    // Verify the token with the auth service
    if (!authorizationHeader) {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
    const token = authorizationHeader.replace('Bearer ', '');
    if (!token) {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
    const response = await firstValueFrom(
      this.httpService.get(
        `${process.env.AUTH_SERVICE_URI}/auth/validate?token=${token}`,
        {
          headers: { authorization: token },
        },
      ),
    );
    // If the token is not valid, throw an error
    if (!response.data.authenticated) {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }

    // Get the user's session information
    const session = await firstValueFrom(
      this.httpService.get(`${process.env.AUTH_SERVICE_URI}/auth/session`, {
        headers: { authorization: authorizationHeader },
      }),
    );

    const comment = new Comment();
    comment.body = createCommentDto.body;
    comment.userId = session.data._id; // Use the user from the session
    comment.postId = createCommentDto.postId;

    return this.commentsRepository.save(comment);
  }

  findByPost(postId: string) {
    return this.commentsRepository.find({ where: { postId: postId } });
  }

  findOne(id: string) {
    return this.commentsRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }
}
