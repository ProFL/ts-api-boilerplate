import {IsDefined, IsEmail, Length, IsString} from 'class-validator';
import {IsConfirmationOf} from '../decorators/is-confirmation-of.decorator';

export class AuthDto {
  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  @Length(6, 72)
  password: string;

  @IsDefined()
  @IsConfirmationOf('password')
  passwordConfirmation: string;
}
