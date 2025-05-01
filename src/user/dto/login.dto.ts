import { PickType } from '@nestjs/swagger';
import { UserEntity } from './entity/user.entity';

export class LogInDto extends PickType(UserEntity, ['email', 'password']) {}
