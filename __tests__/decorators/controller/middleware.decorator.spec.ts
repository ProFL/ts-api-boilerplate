import * as express from 'express';
import * as supertest from 'supertest';
import givenTestController from '../../fixtures/controllers/given-test-controller.fixture';

describe('@Middleware(Handler)', () => {
  let agent: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    const app = express();

    app.use(givenTestController().loadRoutes());

    agent = supertest(app);
  });

  test('an annotated method should execute a single middleware', async () => {
    await agent
      .get('/test/single-middleware')
      .expect(200)
      .expect('X-Middlewared', 'true');
  });

  test('an annotated method should execute multiple middlewares in top down sequence', async () => {
    await agent
      .get('/test/multi-middleware')
      .expect(200)
      .expect('X-Middlewared', '1234');
  });

  test("a not-annotated method shouldn't execute middlewares", async () => {
    const res = await agent.get('/test').expect(200);
    expect(res.header['X-Middlewared']).toBeUndefined();
  });
});
