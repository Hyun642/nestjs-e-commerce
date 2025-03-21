import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../user.entity';

export class LogInDto extends PickType(UserEntity, ['email', 'password']) {}
