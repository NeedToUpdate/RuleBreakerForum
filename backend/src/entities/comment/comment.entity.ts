import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  userId: string;

  @Column()
  postId: string;

  @Column()
  body: string;

  @Column({ nullable: true })
  ruleBroken?: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
