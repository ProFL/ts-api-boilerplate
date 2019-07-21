import {DeepPartial} from 'typeorm';
import getRepository from '../../../src/helpers/get-repository.helper';
import {User} from '../../../src/models/User.model';

export async function givenTestUser(
  userData: DeepPartial<User>,
): Promise<User> {
  const userRepo = getRepository(User);
  const user = await userRepo.create(userData);
  return user;
}
