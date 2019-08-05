import {Service} from 'typedi';
import {DeepPartial, Repository} from 'typeorm';
import {InjectRepository} from 'typeorm-typedi-extensions';
import * as uuid from 'uuid/v4';
import {User} from '../../../src/models/User.model';

@Service()
export default class UsersFixtures {
  private static generatedCount = -1;

  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  givenUserData(userData?: DeepPartial<User>): User {
    UsersFixtures.generatedCount += 1;

    const user = new User();
    user.id = uuid();
    user.userName = `testuser${UsersFixtures.generatedCount}`;
    user.firstName = 'Test';
    user.lastName = 'User';
    user.email = `testuser${UsersFixtures.generatedCount}@test.com.br`;
    user.password = '123456';
    user.isAdmin = true;

    if (userData) {
      Object.keys(userData).forEach(key => {
        user[key] = userData[key];
      });
    }

    return user;
  }

  async givenTestUser(userData: DeepPartial<User>): Promise<User> {
    return this.userRepo.save(this.givenUserData(userData));
  }
}
