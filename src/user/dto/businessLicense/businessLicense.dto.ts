import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BusinessLicenseDto {
  @ApiProperty({
    description: '사업자 등록 번호',
    example: '1wqweqwe',
  })
  @IsString()
  @IsNotEmpty()
  businessId: string;
}
