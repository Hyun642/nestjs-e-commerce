import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  description: string;
}
