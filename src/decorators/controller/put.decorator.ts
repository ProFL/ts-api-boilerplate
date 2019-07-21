import {Route} from './route.decorator';

export function Put(path: string) {
  return Route(path, 'put');
}
