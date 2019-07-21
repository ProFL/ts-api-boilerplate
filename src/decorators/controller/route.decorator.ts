export const ROUTE_META_KEY = Symbol('route');

export interface RouteMeta {
  path: string;
  method: string;
}

export function Route(path: string, method: string) {
  return function(target: any, propertyKey?: string): void {
    let decoratorTarget = target;

    if (propertyKey) {
      decoratorTarget = target[propertyKey];
    }

    const routeMeta: RouteMeta[] | undefined = Reflect.getMetadata(
      ROUTE_META_KEY,
      decoratorTarget,
    );

    return Reflect.defineMetadata(
      ROUTE_META_KEY,
      routeMeta ? [...routeMeta, {path, method}] : [{path, method}],
      decoratorTarget,
    );
  };
}
