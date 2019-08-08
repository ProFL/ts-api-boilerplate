import {
  IsDefined,
  IsEmail,
  IsIn,
  IsString,
  Length,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {UserProfile} from '../../../entities/default/user-profile.model';
import {User} from '../../../entities/default/user.model';
import {IsConfirmationOf} from '../../decorators/is-confirmation-of.decorator';
import {IsUnique} from '../../decorators/is-unique.decorator';
import {PermissionLevels} from '../../enums/permission-levels.enum';

class InnerProfile implements Partial<UserProfile> {
  @IsDefined()
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsDefined()
  @IsString()
  @MinLength(2)
  lastName: string;
}

export class CreateUserDto implements Partial<User> {
  @IsDefined()
  @IsEmail()
  @IsUnique(User)
  email: string;

  @IsString()
  @Length(6, 72)
  password: string;

  @IsConfirmationOf('password')
  passwordConfirmation: string;

  @IsDefined()
  @ValidateNested()
  // @ts-ignore
  profile: InnerProfile;

  @IsDefined()
  @IsIn([PermissionLevels.USER])
  permissionLevelId: number;
}
