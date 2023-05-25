import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @MaxLength(100)
  body: string;

  @IsNotEmpty()
  postId: string;

  @IsOptional()
  parentId?: string;
}
