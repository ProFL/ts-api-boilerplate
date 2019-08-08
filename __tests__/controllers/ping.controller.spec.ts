import * as supertest from 'supertest';
import appConfig from '../../src/config/app.config';

describe('PingController', () => {
  let agent: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    const app = await appConfig();
    agent = supertest(app.listen());
  });

  describe('GET /ping', () => {
    test('should return pong', async () => {
      const response = await agent
        .get('/ping')
        .expect('Content-Type', /application\/json/)
        .expect(200);

      expect(response.body.message).toBe('pong');
    });
  });
});
