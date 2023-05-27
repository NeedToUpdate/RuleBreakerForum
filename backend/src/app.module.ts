import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostsModule } from './post/post.module';
import { CommentsModule } from './comment/comment.module';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './middleware/logRequests';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: `${process.env.MONGO_CONNECTION_STRING}`,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      ssl: process.env.MONGO_USE_SSL === 'true',
      useUnifiedTopology: true,
      useNewUrlParser: true,
      logging: true,
      w: 0,
    }),
    UserModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Apply for all routes
  }
}
