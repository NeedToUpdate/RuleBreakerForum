import {
  Entity,
  Column,
  OneToMany,
  ObjectIdColumn,
  ObjectId,
  ManyToMany,
} from 'typeorm';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  username: string;

  @Column()
  email: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
