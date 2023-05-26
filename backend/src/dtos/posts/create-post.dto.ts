import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  rule: string;
}
