import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class BusinessLicenseEntity {
  @ApiProperty({ description: '등록 id', example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ description: '유저 id', example: '123e12wq@ew' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '사업자등록번호', example: '1wqweqwe' })
  @IsString()
  businessId: string;

  @IsOptional()
  @IsDateString()
  deletedAt: Date;

  @IsOptional()
  @IsDateString()
  createdAt: Date;
}
