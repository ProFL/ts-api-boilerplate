import {KoaContext} from '../helpers/interfaces/koa-context.interface';

export default interface AuthService<UserType, CredentialsType> {
  login(user: string, password: string): Promise<CredentialsType>;

  logout(context: KoaContext): Promise<void>;

  isAuthenticated(context: KoaContext): Promise<UserType | undefined>;
}
