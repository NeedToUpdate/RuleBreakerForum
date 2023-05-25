import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';

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

  @Column()
  createdAt: Date;

  @Column()
  comments_num: number;
}
