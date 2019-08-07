import appConfig from '../../src/config/app.config';
import {User} from '../../src/models/user.model';
import UserFixtures from '../fixtures/models/user.fixture';

import supertest = require('supertest');

describe('AuthController', () => {
  let agent: supertest.SuperTest<supertest.Test>;
  let user: User;
  const password = '123456';

  async function loginRequest() {
    return agent
      .post('/api/v1/auth')
      .send({email: user.email, password})
      .expect(200);
  }

  beforeAll(async () => {
    const app = await appConfig();
    agent = supertest(app.listen());

    user = await UserFixtures.givenTestUser({password});
  });

  describe('POST /api/v1/auth', () => {
    let response: supertest.Response;

    beforeAll(async () => {
      response = await loginRequest();
    });

    test('should return a token', () => {
      expect(response.body.token).toBeTruthy();
    });

    test.todo(
      "the token payload should contain the user's profile first and last names",
    );
    test.todo('the token should be valid for 30 days');
  });

  describe('DELETE /api/v1/auth', () => {
    let response: supertest.Response;
    let token: string;

    const logoutRequest = () =>
      agent.del('/api/v1/auth').set('Authorization', `Bearer ${token}`);

    beforeAll(async () => {
      response = await loginRequest();
      ({token} = response.body);

      response = await logoutRequest().expect(204);
    });

    test('token should no longer be valid', async () => {
      response = await logoutRequest().expect(401);
    });
  });
});
