import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import {User} from '../../../../models/User.model';
import {IsConfirmationOf} from '../../../decorators/is-confirmation-of.decorator';
import {IsUnique} from '../../../decorators/is-unique.decorator';

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEmail()
  @IsUnique(User)
  email: string;

  @IsDefined()
  @Length(6, 72)
  password: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsDefined()
  @IsConfirmationOf('password')
  passwordConfirmation: string;
}
