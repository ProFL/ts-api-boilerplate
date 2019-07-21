import * as express from 'express';
import * as supertest from 'supertest';
import ControllerBase from '../../src/controllers/controller-base';
import givenTestController, {
  TestController,
} from '../fixtures/controllers/given-test-controller.fixture';

describe('ControllerBase', () => {
  let testController: TestController;

  beforeAll(async () => {
    testController = givenTestController();
  });

  test('should make the class have a loadRoutes method', () => {
    const controllerBaseProto = ControllerBase.prototype;
    expect(Object.getOwnPropertyNames(controllerBaseProto)).toContain(
      'loadRoutes',
    );
  });

  describe('loadRoutes()', () => {
    test('the loadRoutes method should return a router', () => {
      expect(typeof testController.loadRoutes()).toEqual(
        typeof express.Router(),
      );
    });

    test('(integration) the built router should contain all specified routes', async () => {
      const router: express.Router = testController.loadRoutes();

      const testApp = express();
      testApp.use(router);

      const agent = supertest(testApp);

      await agent
        .get('/test')
        .expect(200)
        .expect({path: '/test', method: 'get'});

      await agent
        .post('/test')
        .expect(200)
        .expect({path: '/test', method: 'post'});

      await agent
        .put('/test')
        .expect(200)
        .expect({path: '/test', method: 'put'});

      await agent
        .put('/test/put-update')
        .expect(200)
        .expect({path: '/test/put-update', method: 'put'});

      await agent
        .patch('/test')
        .expect(200)
        .expect({path: '/test', method: 'patch'});

      await agent
        .patch('/test/patch-update')
        .expect(200)
        .expect({path: '/test/patch-update', method: 'patch'});

      await agent
        .delete('/test')
        .expect(200)
        .expect({path: '/test', method: 'delete'});
    });

    test.todo(
      '(integration) the built router should have registered middlewares',
    );
  });
});
