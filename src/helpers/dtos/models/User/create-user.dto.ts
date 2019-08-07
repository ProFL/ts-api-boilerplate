import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsString,
  Length,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {UserProfile} from '../../../../models/user-profile.model';
import {User} from '../../../../models/user.model';
import {IsConfirmationOf} from '../../../decorators/is-confirmation-of.decorator';
import {IsUnique} from '../../../decorators/is-unique.decorator';
import {PermissionLevels} from '../../../enums/permission-levels.enum';

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
  @IsEnum(PermissionLevels)
  permissionLevelId: number;
}
