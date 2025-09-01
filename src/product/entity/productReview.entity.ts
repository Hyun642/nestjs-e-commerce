import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, MaxLength, MinLength } from 'class-validator';

export class ProductReviewEntity {
  @ApiProperty({ description: '상점 고유 ID', example: 'qwe' })
  @IsString()
  id: string;

  @ApiProperty({ description: '별점', example: '1' })
  @IsString()
  @MinLength(1)
  @MaxLength(5)
  score: number;

  @ApiProperty({ description: '리뷰 본문', example: '배송도 빠르고 맛있네요.' })
  @IsString()
  content: string;

  @ApiProperty({
    description: '생성 일시',
    example: '2025-02-12T02:00:00.000Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: '수정 일시',
    example: '2025-02-12T02:00:00.000Z',
  })
  @IsDateString()
  updatedAt: Date;
}
