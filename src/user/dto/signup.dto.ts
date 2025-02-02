import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(10)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts Eng and Number',
    //영문과 숫자
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10,15}$/, {
    message: 'Phone number must be 10 to 15 digits',
  })
  phoneNumber: string;
}
