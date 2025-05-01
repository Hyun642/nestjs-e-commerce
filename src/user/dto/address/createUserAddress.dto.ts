import { PickType } from '@nestjs/swagger';
import { UserAddressEntity } from '../entity/userAddress.entity';

export class CreateUserAddressDto extends PickType(UserAddressEntity, [
  'name',
  'address',
]) {}
