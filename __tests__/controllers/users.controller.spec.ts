import * as supertest from 'supertest';
import appConfig from '../../src/config/app.config';

describe('UsersController', () => {
  let agent: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    const app = await appConfig();
    agent = supertest(app.listen());
  });

  describe('GET /api/v1/users', () => {
    test.todo('should require admin level authorization');
    test.todo('should return all users');
  });

  describe('GET /api/v1/users/:id', () => {
    test.todo('should allow user to see own data');
    test.todo("shouldn't allow user to see other user's data");
    test.todo("should allow manager to see employee's data");
    test.todo("shouldn't allow manager to see other manager's data");
    test.todo("should allow the admin to see anyone's data");
  });

  describe('POST /api/v1/users', () => {
    test.todo('should create a new user on the database');
    test.todo(
      "shouldn't allow creating a user with more than basic permissions",
    );
  });

  describe('PATCH /api/v1/users/:id', () => {
    test.todo('should allow the user to edit some of its own data');
    test.todo("shouldn't allow the user to edit someone else's data");
    test.todo("should allow the manager to edit employee's data");
    test.todo("shouldn't allow the manager to edit other manager's data");
    test.todo("should allow the admin to edit everyone's data");
  });

  describe('DELETE /api/v1/users/:id', () => {
    test.todo('should allow a user to delete himself');
    test.todo("shouldn't allow a user to delete someone else");
    test.todo('should allow a manager to delete an employee');
    test.todo("shouldn't allow a manager to delete another manager");
    test.todo('should allow an admin to delete anyone');
  });
});
