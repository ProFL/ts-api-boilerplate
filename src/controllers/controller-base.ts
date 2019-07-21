import {Handler, Router} from 'express';
import {
  RouteMeta,
  ROUTE_META_KEY,
} from '../decorators/controller/route.decorator';
import {MIDDLEWARE_META_KEY} from '../decorators/controller';

/**
 * Base class for Controllers that brings utility methods to work with
 * the Route and Middleware decorators.
 *
 * Paths are composed of the basePath + the decorated path.
 * By default, the basePath is empty, although having it match the
 * controller's name is the recommended way to go.
 */
export default abstract class ControllerBase {
  /**
   * This controller's internal router object, may be used to
   * customize its behaviour, such as adding 'controlller wide'
   * middleware or custom param handlers.
   */
  protected readonly router: Router = Router();

  /**
   * ControllerBase constructor that can be used to customize the basePath
   *
   * @param {string} basePath The base path of this controller's routes
   */
  constructor(public readonly basePath: string = '') {}

  /**
   * Method that loads the routes from this controller's prototype,
   * using the Route anotated methods, along with its annotated middleware.
   *
   * @returns This controller's internal router with the routes configured
   */
  loadRoutes(): Router {
    const controllerPrototype = Object.getPrototypeOf(this);

    Object.getOwnPropertyNames(controllerPrototype).forEach(propName => {
      const routeMeta: RouteMeta[] = Reflect.getMetadata(
        ROUTE_META_KEY,
        controllerPrototype[propName],
      );

      const middlewareMeta: Handler[] = Reflect.getMetadata(
        MIDDLEWARE_META_KEY,
        controllerPrototype[propName],
      );

      if (routeMeta) {
        const handler = this[propName];

        routeMeta.forEach(({path, method}) => {
          const effectiveRoute = `/${[
            ...this.basePath.split('/'),
            ...path.split('/'),
          ]
            .filter(p => p.length >= 1)
            .join('/')}`;

          this.router[method](
            effectiveRoute,
            middlewareMeta ? [...middlewareMeta, handler] : handler,
          );
        });
      }
    });

    return this.router;
  }
}
