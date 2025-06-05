import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString } from 'class-validator';

export class CartEntity {
  @ApiProperty({ description: 'cart ID', example: '23' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'User ID', example: 'qwe' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'product ID', example: 'qwe' })
  @IsString()
  productId: string;

  @ApiProperty({ description: '수량', example: '2' })
  @IsInt()
  quantity: number;

  @ApiProperty({ description: '생성일시', example: '2025-02-12T02:00:00.000Z' })
  @IsDateString()
  createdAt: Date;
}
