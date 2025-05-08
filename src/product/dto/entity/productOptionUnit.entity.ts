import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ProductOptionUnitEntity {
  @ApiProperty({
    description: '상품 옵션 유닛 ID',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: '옵션 유닛명',
    example: '빨강',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: '재고 수량',
    example: 100,
  })
  @IsNotEmpty()
  @IsInt()
  stock: number;

  @ApiProperty({
    description: '옵션 가격',
    example: 3000,
  })
  @IsInt()
  additionalPrice: number;
}
