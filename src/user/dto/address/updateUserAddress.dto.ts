import { PickType } from '@nestjs/swagger';
import { UserAddressEntity } from '../../entity/userAddress.entity';

export class UpdateUserAddressDto extends PickType(UserAddressEntity, [
  'name',
  'address',
]) {}
