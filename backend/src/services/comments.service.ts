import { CreateCommentDto } from '@/dtos/comments/create-comment.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { MongoRepository } from 'typeorm';
import { Comment } from '@/entities/comment/comment.entity';
import { Post } from '@/entities/post/post.entity';
import { ObjectId } from 'mongodb';
import { Gpt3Service } from './gpt3.service';
import { sanitizeInput } from '@/utils/commentSanitizer';
import { getRuleBroken } from '@/utils/judgementExtractor';
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: MongoRepository<Comment>,
    @InjectRepository(Post)
    private postsRepository: MongoRepository<Post>,
    private readonly httpService: HttpService,
    private readonly gpt3Service: Gpt3Service,
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
    const post = await this.postsRepository.findOne({
      where: { _id: new ObjectId(createCommentDto.postId) },
    });
    if (!post) {
      throw new HttpException('No Post Found', HttpStatus.NOT_FOUND);
    }
    if (post.usersBanned.includes(session.data._id)) {
      throw new HttpException('User Is Banned', HttpStatus.FORBIDDEN);
    }
    const gpt3Response = await this.gpt3Service.judgeComment(
      sanitizeInput(comment.body),
      post.rules.map((x) => sanitizeInput(x[1])),
    );
    const ruleBroken = getRuleBroken(gpt3Response);
    console.log(getRuleBroken(gpt3Response)); // log the GPT-3 response
    if (ruleBroken !== undefined) {
      comment.ruleBroken = ruleBroken;
      post.usersBanned.push(session.data._id);
      this.postsRepository.save(post);

      const updatedUsers = [...post.usersBanned, session.data._id];

      await this.postsRepository.update(post.id, {
        usersBanned: updatedUsers,
      });
    }
    return this.commentsRepository.save(comment);
  }

  findByPost(postId: string, page: number) {
    const commentsPerPage = 20; // Number of posts per page
    const skip = (page - 1) * commentsPerPage; // Calculate the number of posts to skip
    const take = commentsPerPage; // Number of posts to take
    return this.commentsRepository.find({
      take,
      skip,
      where: { postId: postId },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.commentsRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }
}
