import {
  Entity,
  ObjectId,
  ObjectIdColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from '../user/user';
import { Comment } from '../comment/comment';

@Entity()
export class Post {
  @ObjectIdColumn()
  id: ObjectId;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToOne(() => User, (user) => user.postsBannedFrom)
  userBanned: User;

  @Column('simple-array')
  rules: string[];

  @Column()
  createdAt: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
