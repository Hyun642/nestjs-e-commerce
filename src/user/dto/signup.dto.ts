import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entity/user.entity';

export class SignUpDto extends PickType(UserEntity, [
  'email',
  'name',
  'password',
  'phoneNumber',
] as const) {}
