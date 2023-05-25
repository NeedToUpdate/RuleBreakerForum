import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Post {
  @ObjectIdColumn()
  id: ObjectId;

  @Column(() => User)
  user: User;

  @Column(() => User)
  usersBanned: User[];

  @Column('json')
  rules: [string, string][];

  @Column()
  title: string;

  @Column()
  createdAt: Date;

  @Column()
  comments_num: number;
}
