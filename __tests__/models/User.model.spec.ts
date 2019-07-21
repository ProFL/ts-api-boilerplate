import {Connection, Repository} from 'typeorm';
import ormConfig from '../../src/config/orm.config';
import bcryptHelper from '../../src/helpers/bcrypt.helper';
import {User} from '../../src/models/User.model';
import givenUserData from '../fixtures/models/given-user-data.fixture';
import jwtHelper from '../../src/helpers/jwt.helper';

describe('User Entity', function() {
  let ormConnection: Connection;
  let userRepo: Repository<User>;
  let testUser: User;
  let userPassword: string;

  beforeAll(async () => {
    ormConnection = await ormConfig();
    userRepo = ormConnection.getRepository(User);

    userPassword = '123456';
    testUser = givenUserData({password: userPassword});
    testUser.hashPassword();

    testUser = await userRepo.save(testUser);
  });

  afterAll(async () => {
    await userRepo.delete(testUser.id);
    await ormConnection.close();
  });

  describe('generatePasswordToken()', function() {
    test('should generate valid jwt token', async () => {
      const user: User = givenUserData({
        firstName: 'João',
        lastName: 'das Neves',
      });
      await user.generatePasswordToken();

      const tokenData = await jwtHelper.verify<Partial<User>>(
        user.passwordToken,
      );

      expect(tokenData.id).toEqual(user.id);
      expect(tokenData.firstName).toEqual(user.firstName);
      expect(tokenData.lastName).toEqual(user.lastName);
    });

    test('should be triggered before inserting a new user', async () => {
      let user = givenUserData();
      user = await userRepo.save(user);

      expect(user.passwordToken).toBeTruthy();
      expect(await jwtHelper.verify(user.passwordToken)).toBeTruthy();
    });
  });

  describe('hashPassword()', function() {
    test('should be triggered before a user is updated', async () => {
      const newPassword = userPassword
        .split('')
        .reverse()
        .join('');
      testUser.password = newPassword;
      testUser = await userRepo.save(testUser);

      expect(await bcryptHelper.compare(newPassword, testUser.password)).toBe(
        true,
      );

      testUser.password = userPassword;
      testUser = await userRepo.save(testUser);
    });
  });

  describe('checkPassword(password)', function() {
    test('should return true on the right password', async () => {
      const password = '123456';
      const user = givenUserData({password});
      user.password = password;
      await user.hashPassword();

      expect(await user.checkPassword(password)).toBe(true);
    });

    test('should return false on a wrong password', async () => {
      const password = '123456';
      const user = givenUserData({password});
      user.password = password;
      await user.hashPassword();

      expect(await user.checkPassword(`${password}7`)).toBe(false);
    });
  });
});
