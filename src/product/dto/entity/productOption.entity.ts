import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean } from 'class-validator';

export class ProductOptionEntity {
  @ApiProperty({
    description: '상품 옵션 ID',
    example: 'opt-12345',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: '상품 옵션명',
    example: '색상',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '수량',
    example: 50,
  })
  @IsInt()
  stock: number;

  @ApiProperty({
    description: '필수 여부',
    example: true,
  })
  @IsBoolean()
  isRequired: boolean;
}
