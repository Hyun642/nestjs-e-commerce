import { ApiProperty } from '@nestjs/swagger';

// 데이터 없이 기본 결과만 제공
export class DefaultResponseDto {
  @ApiProperty({ example: '실행 결과' })
  message: string;

  @ApiProperty({ example: 'success' })
  result: string;

  @ApiProperty({ example: 200 })
  statusCode: number;
}
