import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductBaseDto } from './productBase.dto';
import { productImageDto } from './productImage.dto';
import { ProductOptionDto } from './productOption.dto';

export class ProductDto extends ProductBaseDto {
  @ApiProperty({ type: [productImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => productImageDto)
  image: productImageDto[];

  @ApiProperty({ type: [ProductOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionDto)
  option: ProductOptionDto[];
}
