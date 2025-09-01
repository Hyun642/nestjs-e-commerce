import { ApiProperty } from '@nestjs/swagger';

class ProductionOptionUnitDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  additionalPrice: number;
}

class CartItemOptionUnitDto {
  @ApiProperty({ type: ProductionOptionUnitDto })
  productionOptionUnit: ProductionOptionUnitDto;
}

class ProductInfoDto {
  @ApiProperty()
  price: number;
}

export class CartItemWithOptionUnitsDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;

  @ApiProperty({ type: ProductInfoDto })
  product: ProductInfoDto;

  @ApiProperty({ type: [CartItemOptionUnitDto] })
  cartItemOptionUnit: CartItemOptionUnitDto[];
}
