import {Route} from './route.decorator';

export function Patch(path: string) {
  return Route(path, 'patch');
}
