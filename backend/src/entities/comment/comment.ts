import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ObjectIdColumn,
  ObjectId,
} from 'typeorm';
import { Post } from '../post/post';
import { User } from '../user/user';

@Entity()
export class Comment {
  @ObjectIdColumn()
  id: ObjectId;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @Column()
  body: string;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];

  @ManyToOne(() => Comment, (comment) => comment.children)
  parent: Comment;
}
