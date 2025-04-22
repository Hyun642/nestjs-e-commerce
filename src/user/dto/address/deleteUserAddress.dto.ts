import { Type } from 'class-transformer';

export class DeleteUserAddressDto {
  @Type(() => Number)
  userAddressId: number;
}
