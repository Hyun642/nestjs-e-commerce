import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsDateString, IsInt, IsString } from 'class-validator';

export class OrderEntity {
  @ApiProperty({ description: 'order ID', example: 'qwe' })
  @IsInt()
  id: string;

  @ApiProperty({ description: 'User ID', example: 'qwe' })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '진행 상태',
    example: '결제완료',
    enum: OrderStatus,
  })
  orderStatus: OrderStatus;

  @ApiProperty({ description: '생성일시', example: '2025-02-12T02:00:00.000Z' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ description: '취소일시', example: '2025-02-12T02:00:00.000Z' })
  @IsDateString()
  canceledAt: Date;
}
