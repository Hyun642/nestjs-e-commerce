import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class productReviewImageEntity {
  @ApiProperty({ description: 'ReviewId', example: '123' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'ProductId', example: '123' })
  @IsInt()
  productReviewId: number;

  @ApiProperty({ description: 'ImageUrl', example: 'www.qwe.com' })
  @IsString()
  url: string;
}
