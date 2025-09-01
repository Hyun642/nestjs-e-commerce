import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class OrderItemEntity {
  @ApiProperty({ description: 'order ID', example: 'qwe' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'User ID', example: 'qwe' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'User ID', example: 'qwe' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'User ID', example: 'qwe' })
  @IsString()
  productOptionUnitId: number;

  @ApiProperty({ description: '수량', example: '2' })
  @IsInt()
  quantity: number;
}
