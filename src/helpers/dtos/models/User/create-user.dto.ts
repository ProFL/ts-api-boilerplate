import {
  IsAlphanumeric,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';
import {User} from '../../../../models/User.model';
import {IsUnique} from '../../../decorators/is-unique.decorator';

export class CreateUserDto implements Partial<User> {
  @IsDefined()
  @IsString()
  @IsAlphanumeric()
  @MinLength(2)
  @IsUnique(User)
  userName: string;

  @IsDefined()
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsDefined()
  @IsString()
  @MinLength(2)
  lastName: string;

  @IsDefined()
  @IsEmail()
  @IsUnique(User)
  email: string;

  @IsDefined()
  @IsBoolean()
  isAdmin: boolean;
}
