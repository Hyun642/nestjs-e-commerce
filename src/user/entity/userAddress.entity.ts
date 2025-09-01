import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class UserAddressEntity {
  @ApiProperty({ description: '주소 ID', example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ description: '사용자 ID', example: '1#ekw12@3w2' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '주소 별칭: 집, 회사', example: '집' })
  @IsString()
  name: string;

  @ApiProperty({
    description: '상세 주소',
    example: '경기도 수원시 오리로 2-1, 101동 101호',
  })
  @IsString()
  address: string;
}
