import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class ShopEntity {
  @ApiProperty({ description: '상점 고유 ID', example: 'qwe' })
  @IsString()
  id: string;

  @ApiProperty({ description: '사용자 고유 ID', example: 'qwe' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '사용자 이름', example: '홍길동 과일 가게' })
  @IsString()
  name: string;

  @ApiProperty({ description: '상점 설명', example: '신선한 과일 판매' })
  @IsString()
  description: string;

  @ApiProperty({ description: '생성일시', example: '2025-02-12T02:00:00.000Z' })
  @IsDateString()
  createdAt: Date;
}
