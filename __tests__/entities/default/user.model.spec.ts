import Container from 'typedi';
import {Connection, Repository} from 'typeorm';
import * as uuid from 'uuid/v4';
import ormConfig from '../../../src/config/orm.config';
import {AuthTokenPayload} from '../../../src/helpers/interfaces/auth-token-payload.interface';
import {User} from '../../../src/entities/default/user.model';
import BcryptService from '../../../src/services/bcrypt.service';
import JwtService from '../../../src/services/jwt.service';
import UserFixtures from '../../fixtures/entities/default/user.fixture';

describe('User Entity', () => {
  let bcryptService: BcryptService;
  let jwtService: JwtService;

  let ormConnection: Connection;
  let userRepo: Repository<User>;
  let testUser: User;
  const userPassword = '123456';

  beforeAll(async () => {
    ({default: ormConnection} = await ormConfig());

    bcryptService = Container.get(BcryptService);
    jwtService = Container.get(JwtService);

    userRepo = ormConnection.getRepository(User);

    testUser = await UserFixtures.givenTestUser({password: userPassword});
  });

  afterAll(async () => {
    await userRepo.delete(testUser.id);
    await ormConnection.close();
  });

  describe('generatePasswordToken()', () => {
    test('should generate valid jwt token', async () => {
      const user: User = await UserFixtures.givenUserData({
        profile: {
          id: uuid(),
          firstName: 'João',
          lastName: 'das Neves',
        },
      });
      await user.generatePasswordToken();

      const tokenData = await jwtService.verify<AuthTokenPayload>(
        user.passwordToken,
      );

      expect(tokenData.id).toEqual(user.id);
      expect(tokenData.profile).toEqual(user.profile);
    });

    test('should be triggered before inserting a new user', async () => {
      const user = await UserFixtures.givenTestUser();

      expect(user.passwordToken).toBeTruthy();
      expect(await jwtService.verify(user.passwordToken)).toBeTruthy();
    });
  });

  describe('hashPassword()', () => {
    test('should be triggered before a user is updated', async () => {
      const newPassword = userPassword
        .split('')
        .reverse()
        .join('');
      testUser.password = newPassword;
      testUser = await userRepo.save(testUser);

      expect(await bcryptService.compare(newPassword, testUser.password)).toBe(
        true,
      );

      testUser.password = userPassword;
      testUser = await userRepo.save(testUser);
    });
  });

  describe('checkPassword(password)', () => {
    test('should return true on the right password', async () => {
      const password = '123456';
      const user = await UserFixtures.givenUserData({password});
      user.password = password;
      await user.hashPassword();

      expect(await user.checkPassword(password)).toBe(true);
    });

    test('should return false on a wrong password', async () => {
      const password = '123456';
      const user = await UserFixtures.givenUserData({password});
      user.password = password;
      await user.hashPassword();

      expect(await user.checkPassword(`${password}7`)).toBe(false);
    });
  });
});
