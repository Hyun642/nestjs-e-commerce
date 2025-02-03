import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LogInDto {
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(10)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts Eng and Number',
    //영문과 숫자 4~10자리
  })
  password: string;
}
