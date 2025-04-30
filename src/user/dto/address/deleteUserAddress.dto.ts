import { PickType } from '@nestjs/swagger';
import { UserAddressEntity } from '../entity/userAddress.entity';

export class DeleteUserAddressDto extends PickType(UserAddressEntity, ['id']) {}
