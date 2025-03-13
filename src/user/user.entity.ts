import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  Matches,
  IsDateString,
} from 'class-validator';

export class UserEntity {
  @ApiProperty({ description: '사용자 고유 ID', example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com' })
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호',
    example: '1234abc',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts Eng and Number',
    //영문과 숫자
  })
  password: string;

  @ApiProperty({ description: '사용자 이름', example: '홍길동' })
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '번호', example: '01012345678' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10,11}$/, {
    message: 'Phone number must be 10 to 15 digits',
  })
  phoneNumber: string;

  @ApiProperty({ description: '생성일시', example: '2025-02-12T02:00:00.000Z' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ description: '수정일시', example: '2025-02-12T03:00:00.000Z' })
  @IsDateString()
  updatedAt: Date;

  @ApiProperty({
    description: '삭제일시 (삭제되지 않았다면 null)',
    example: '2025-02-12T04:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  deletedAt?: Date;
}
