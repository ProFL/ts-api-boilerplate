import {DeepPartial, getConnection, Repository} from 'typeorm';
import * as uuid from 'uuid/v4';
import {PermissionLevels} from '../../../../src/helpers/enums/permission-levels.enum';
import {UserProfile} from '../../../../src/entities/default/user-profile.model';
import {User} from '../../../../src/entities/default/user.model';
import PermissionLevelFixture from './permission-level.fixture';

export default class UserFixtures {
  private static generatedCount = -1;

  private static get userRepo(): Repository<User> {
    return getConnection().getRepository(User);
  }

  private static get userProfileRepo(): Repository<UserProfile> {
    return getConnection().getRepository(UserProfile);
  }

  static async givenUserData(userData?: DeepPartial<User>): Promise<User> {
    this.generatedCount += 1;

    const user = this.userRepo.create({
      id: uuid(),
      email: `testuser${this.generatedCount}@test.com.br`,
      password: '123456',
      profile: this.userProfileRepo.create({
        id: uuid(),
        firstName: 'Test',
        lastName: `User ${this.generatedCount}`,
      }),
      permissionLevel: await PermissionLevelFixture.givenPermissionLevel(
        PermissionLevels.USER,
      ),
    });

    Object.assign(user, userData);

    return user;
  }

  static async givenTestUser(userData?: DeepPartial<User>): Promise<User> {
    const validUserData = await this.givenUserData(userData);
    validUserData.profile = await this.userProfileRepo.save(
      validUserData.profile,
    );

    return this.userRepo.save(validUserData);
  }
}
