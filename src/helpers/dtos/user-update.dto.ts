import {IsDefined, IsString, Length} from 'class-validator';
import {User, UserValidationGroups} from '../../models/User.model';
import {IsConfirmationOf} from '../decorators/is-confirmation-of.decorator';

export class UserUpdateDto extends User {
  @IsDefined({groups: ['update'] as UserValidationGroups[]})
  @IsConfirmationOf('password', {groups: ['update'] as UserValidationGroups[]})
  passwordConfirmation: string;

  @IsString()
  @Length(6, 72, {groups: ['update']})
  newPassword: string;

  @IsConfirmationOf('newPassword', {
    groups: ['update'] as UserValidationGroups[],
  })
  newPasswordConfirmation: string;
}
