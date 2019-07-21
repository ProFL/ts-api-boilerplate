import {Route} from './route.decorator';

export function Post(path: string) {
  return Route(path, 'post');
}
