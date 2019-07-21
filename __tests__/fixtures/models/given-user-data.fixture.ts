import {DeepPartial} from 'typeorm';
import * as uuid from 'uuid/v4';
import {User} from '../../../src/models/User.model';

let generatedCount = -1;
export default function givenUserData(userData?: DeepPartial<User>): User {
  generatedCount += 1;

  const user = new User();
  user.id = uuid();
  user.userName = `testuser${generatedCount}`;
  user.firstName = 'Test';
  user.lastName = 'User';
  user.email = `testuser${generatedCount}@test.com.br`;
  user.password = '123456';
  user.isAdmin = true;

  if (userData) {
    Object.keys(userData).forEach(key => {
      user[key] = userData[key];
    });
  }

  return user;
}
