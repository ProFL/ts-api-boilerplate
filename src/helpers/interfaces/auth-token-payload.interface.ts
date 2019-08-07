import {UserProfile} from '../../models/user-profile.model';
import {PermissionLevels} from '../enums/permission-levels.enum';

export interface AuthTokenPayload {
  id: string;

  profile: Partial<UserProfile>;

  permissionLevel: PermissionLevels;
}
