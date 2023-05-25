import {
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ArrayNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayNotEmpty()
  @IsString({ each: true })
  @MaxLength(30, { each: true })
  readonly rules: [string, string][];
}
