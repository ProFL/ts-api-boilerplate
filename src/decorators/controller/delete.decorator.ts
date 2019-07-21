import {Route} from './route.decorator';

export function Delete(path: string) {
  return Route(path, 'delete');
}
