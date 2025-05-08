import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ProductEntity {
  @ApiProperty({ description: '상품 고유 번호', example: 'qwe123' })
  @IsString()
  id: string;

  @ApiProperty({ description: '상품 이름', example: '사과' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '상품 설명', example: '맛있는 사과' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: '가격',
    example: 10000,
  })
  @IsNotEmpty()
  @IsInt()
  price: number;

  @ApiProperty({
    description: '대표 이미지 링크',
    example:
      'https://private-user-images.githubusercontent.com/55094745/239910738-ce7c1b5b-4367-4713-99e2-3de51bac6cbb.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDY2MDE4MTQsIm5iZiI6MTc0NjYwMTUxNCwicGF0aCI6Ii81NTA5NDc0NS8yMzk5MTA3MzgtY2U3YzFiNWItNDM2Ny00NzEzLTk5ZTItM2RlNTFiYWM2Y2JiLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA1MDclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNTA3VDA3MDUxNFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWRhYjYzNmU0OWU1MDhlOWI2MGI3YjAxZjQ5ZDE4YmRiYzdiZDE5OWJmMWQ5YzM1ZWRlYzZmOGE1NDM1NDlhOTUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.DOlXok-ybS1-grgop3VbLxPk4XZ1STN4iBaDQDpFoRg',
  })
  @IsNotEmpty()
  @IsString()
  thumnailImageUrl: string;
}
