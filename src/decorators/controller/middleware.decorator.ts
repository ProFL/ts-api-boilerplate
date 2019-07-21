import {Handler} from 'express';

export const MIDDLEWARE_META_KEY = Symbol('middleware');

export function Middleware(handlers: Handler | Handler[]) {
  return function(
    target: any,
    propertyKey?: string,
    propertyDescriptor?: PropertyDescriptor,
  ): void {
    let decoratorTarget = target;

    if (propertyKey) {
      decoratorTarget = target[propertyKey];
    }

    const middlewareMeta: Handler[] | undefined = Reflect.getMetadata(
      MIDDLEWARE_META_KEY,
      decoratorTarget,
    );

    const handlerArray = Array.isArray(handlers) ? handlers : [handlers];

    return Reflect.defineMetadata(
      MIDDLEWARE_META_KEY,
      middlewareMeta ? [...handlerArray, ...middlewareMeta] : handlerArray,
      decoratorTarget,
    );
  };
}
