import {Request, Response} from 'koa';
import {Action} from 'routing-controllers';
import {AuthorizationChecker} from 'routing-controllers/AuthorizationChecker';
import {CurrentUserChecker} from 'routing-controllers/CurrentUserChecker';
import Container from 'typedi';
import {KoaContext} from '../helpers/interfaces/koa-context.interface';
import {User} from '../entities/default/user.model';
import AuthService from '../services/auth.service';
import JwtAuthService from '../services/jwt-auth.service';

export interface CustomAction extends Action {
  request: Request;
  response: Response;
  context: KoaContext;
}

export interface AuthHandlers {
  authorizationChecker: AuthorizationChecker;
  currentUserChecker: CurrentUserChecker;
}

export default function authConfig(): AuthHandlers {
  const authService: AuthService<User, string> = Container.get(JwtAuthService);
  const authorizationChecker: AuthorizationChecker = async (
    {context}: CustomAction,
    roles: number | number[],
  ) => {
    // Authentication Cycle
    // eslint-disable-next-line no-param-reassign
    context.state.user = await authService.isAuthenticated(context);

    // Authorization Cycle
    // TODO: Implement and validate user roles

    return true;
  };

  const currentUserChecker: CurrentUserChecker = async ({context}) =>
    authService.isAuthenticated(context);

  return {authorizationChecker, currentUserChecker};
}
