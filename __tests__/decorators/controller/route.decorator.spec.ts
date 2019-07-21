import {RouteMeta, ROUTE_META_KEY} from '../../../src/decorators/controller';
import givenTestController, {
  TestController,
} from '../../fixtures/controllers/given-test-controller.fixture';

describe('@Route(path, method)', () => {
  let testController: TestController;
  beforeAll(async () => {
    testController = givenTestController();
  });

  test('an anotated method should have route metadata', () => {
    const metadata: RouteMeta[] = Reflect.getMetadata(
      ROUTE_META_KEY,
      testController.getTest,
    );

    expect(metadata).toContainEqual({
      path: '/',
      method: 'get',
    });
  });

  test("a not anotated method shouldn't have route metadata", () => {
    const metadata: undefined = Reflect.getMetadata(
      ROUTE_META_KEY,
      testController.dummyMethod,
    );

    expect(metadata).toBeUndefined();
  });

  test('the same route may respond to multiple paths and methods', () => {
    const metadata: RouteMeta[] = Reflect.getMetadata(
      ROUTE_META_KEY,
      testController.putPatchUpdate,
    );

    expect(metadata).toContainEqual({
      path: '/put-update',
      method: 'put',
    });

    expect(metadata).toContainEqual({
      path: '/patch-update',
      method: 'patch',
    });
  });
});
