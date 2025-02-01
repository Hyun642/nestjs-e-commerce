import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  gethi(): string {
    return 'Hi';
  }
}
