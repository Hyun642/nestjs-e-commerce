import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserAddressDto {
  @ApiProperty({ description: '주소 별칭: 집, 회사', example: '집' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '상세 주소',
    example: '서울특별시 마포구 합정동 123-45',
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}
