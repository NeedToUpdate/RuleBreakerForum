import { Entity, Column, OneToMany, ObjectIdColumn, ObjectId } from 'typeorm';
import { Post } from '../post/post';
import { Comment } from '../comment/comment';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  username: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Post, (post) => post.userBanned)
  postsBannedFrom: Post[];
}
