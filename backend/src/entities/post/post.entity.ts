import {
  Entity,
  ObjectId,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Post {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  user: string;

  @Column()
  usersBanned: string[];

  @Column('json')
  rules: [string, string][];

  @Column()
  title: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @Column()
  comments_num: number;
}
