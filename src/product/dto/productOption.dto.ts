import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProductOptionEntity } from './entity/productOption.entity';
import { ProductOptionUnitDto } from './productOptionUnit.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductOptionDto extends PickType(ProductOptionEntity, [
  'isRequired',
  'name',
  'stock',
]) {
  @ApiProperty({ type: [ProductOptionUnitDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionUnitDto)
  units: ProductOptionUnitDto[];
}
