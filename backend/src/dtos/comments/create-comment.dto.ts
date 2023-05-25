import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  postId: string;

  @IsOptional()
  parentId?: string;
}
