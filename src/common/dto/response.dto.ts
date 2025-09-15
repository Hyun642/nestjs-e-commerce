import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DefaultResponseDto<T> {
  @ApiProperty({ description: 'API 응답 메시지' })
  message: string;

  @ApiProperty({ description: 'API 응답 결과 (Success/Fail)' })
  result: string;

  @ApiProperty({ description: 'HTTP 상태 코드' })
  statusCode: number;

  @ApiProperty({ description: '응답 데이터 객체' })
  @Type(() => Object)
  data?: T;
}
