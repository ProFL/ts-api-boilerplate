import Container from 'typedi';
import {Connection, Repository} from 'typeorm';
import ormConfig from '../../src/config/orm.config';
import {User} from '../../src/models/User.model';
import BcryptService from '../../src/services/bcrypt.service';
import JwtService from '../../src/services/jwt.service';
import UsersFixtures from '../fixtures/models/users.fixture';

describe('User Entity', function() {
  let usersFixtures: UsersFixtures;
  let bcryptService: BcryptService;
  let jwtService: JwtService;
  let ormConnection: Connection;
  let userRepo: Repository<User>;
  let testUser: User;
  let userPassword: string;

  beforeAll(async () => {
    ormConnection = await ormConfig();

    usersFixtures = Container.get(UsersFixtures);
    bcryptService = Container.get(BcryptService);
    jwtService = Container.get(JwtService);

    userRepo = ormConnection.getRepository(User);

    userPassword = '123456';
    testUser = usersFixtures.givenUserData({password: userPassword});
    testUser.hashPassword();

    testUser = await userRepo.save(testUser);
  });

  afterAll(async () => {
    await userRepo.delete(testUser.id);
    await ormConnection.close();
  });

  describe('generatePasswordToken()', function() {
    test('should generate valid jwt token', async () => {
      const user: User = usersFixtures.givenUserData({
        firstName: 'João',
        lastName: 'das Neves',
      });
      await user.generatePasswordToken();

      const tokenData = await jwtService.verify<Partial<User>>(
        user.passwordToken,
      );

      expect(tokenData.id).toEqual(user.id);
      expect(tokenData.firstName).toEqual(user.firstName);
      expect(tokenData.lastName).toEqual(user.lastName);
    });

    test('should be triggered before inserting a new user', async () => {
      let user = usersFixtures.givenUserData();
      user = await userRepo.save(user);

      expect(user.passwordToken).toBeTruthy();
      expect(await jwtService.verify(user.passwordToken)).toBeTruthy();
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

      expect(await bcryptService.compare(newPassword, testUser.password)).toBe(
        true,
      );

      testUser.password = userPassword;
      testUser = await userRepo.save(testUser);
    });
  });

  describe('checkPassword(password)', function() {
    test('should return true on the right password', async () => {
      const password = '123456';
      const user = usersFixtures.givenUserData({password});
      user.password = password;
      await user.hashPassword();

      expect(await user.checkPassword(password)).toBe(true);
    });

    test('should return false on a wrong password', async () => {
      const password = '123456';
      const user = usersFixtures.givenUserData({password});
      user.password = password;
      await user.hashPassword();

      expect(await user.checkPassword(`${password}7`)).toBe(false);
    });
  });
});
