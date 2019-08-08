import {IsEmail, IsEnum, IsString, Length} from 'class-validator';
import {User} from '../../../entities/default/user.model';
import {IsConfirmationOf} from '../../decorators/is-confirmation-of.decorator';
import {IsUnique} from '../../decorators/is-unique.decorator';
import {PermissionLevels} from '../../enums/permission-levels.enum';

export class UpdateUserDto {
  @IsEmail()
  @IsUnique(User)
  email: string;

  @IsString()
  @Length(6, 72)
  password: string;

  @IsConfirmationOf('password')
  passwordConfirmation: string;

  @IsEnum(PermissionLevels)
  permissionLevelId: number;
}
