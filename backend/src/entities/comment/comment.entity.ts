import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

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
}
