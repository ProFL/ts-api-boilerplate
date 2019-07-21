import {Route} from './route.decorator';

export function Get(path: string) {
  return Route(path, 'get');
}
