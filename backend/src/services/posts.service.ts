import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Post } from '@/entities/post/post.entity';
import { CreatePostDto } from '@/dtos/posts/create-post.dto';
import { UpdatePostDto } from '@/dtos/posts/update-post.dto';
import { firstValueFrom } from 'rxjs';
import { ObjectId } from 'mongodb';
import { Comment } from '@/entities/comment/comment.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: MongoRepository<Post>,
    @InjectRepository(Comment)
    private commentsRepository: MongoRepository<Comment>,
    private readonly httpService: HttpService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    authorizationHeader: string,
  ): Promise<Post> {
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

    const post = new Post();
    post.title = createPostDto.title;
    post.rules = [[session.data._id, createPostDto.rule]];
    post.user = session.data._id; // Use the user from the session
    post.usersBanned = [];
    post.createdAt = new Date();
    post.comments_num = 0;

    return this.postsRepository.save(post);
  }

  async findAll(page: number) {
    const postsPerPage = 10; // Number of posts per page
    const skip = (page - 1) * postsPerPage; // Calculate the number of posts to skip
    const take = postsPerPage; // Number of posts to take

    const posts = await this.postsRepository.find({
      take,
      skip,
      order: { createdAt: 'DESC' },
    });

    for (const post of posts) {
      post.comments_num = await this.commentsRepository.count({
        postId: post.id.toString(),
      });
    }

    return posts;
  }

  async findOne(id: string) {
    const post = await this.postsRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postsRepository.update(id, updatePostDto);
  }

  async remove(id: string, authorizationHeader: string) {
    if (!authorizationHeader) {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
    const token = authorizationHeader.replace('Bearer ', '');
    if (!token) {
      console.log(token);
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

    const post = await this.postsRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    console.log(post.user, session.data._id);
    if (post.user !== session.data._id) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }

    return this.postsRepository.delete(id);
  }

  async addRule(id: string, rule: string, userId: string) {
    if (!userId) {
      throw new HttpException('Not Authorized.', HttpStatus.FORBIDDEN);
    }
    const post = await this.postsRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    const updatedRules: [string, string][] = [...post.rules, [userId, rule]];

    return await this.postsRepository.update(id, { rules: updatedRules });
  }
}
