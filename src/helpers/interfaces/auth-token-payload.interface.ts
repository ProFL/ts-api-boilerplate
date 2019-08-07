import {UserProfile} from '../../models/user-profile.model';

export interface AuthTokenPayload {
  id: string;
  profile: Partial<UserProfile>;
}
