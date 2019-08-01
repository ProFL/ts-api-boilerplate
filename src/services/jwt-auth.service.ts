import {Context} from 'koa';
import {BadRequestError, UnauthorizedError} from 'routing-controllers';
import {Service} from 'typedi';
import {getRepository, Repository} from 'typeorm';
import {AuthTokenPayload} from '../helpers/interfaces/auth-token-payload.interface';
import {KoaContext} from '../helpers/interfaces/koa-context.interface';
import {User} from '../models/User.model';
import AuthService from './auth.service';
import JwtService from './jwt.service';

@Service('jwt.auth-service')
export default class JwtAuthService implements AuthService<User, string> {
  constructor(private readonly jwtService: JwtService) {}

  private get userRepo(): Repository<User> {
    return getRepository(User);
  }

  private getTokenFromHeader(header: string): string {
    const match = /^Bearer (.*)/g.exec(header);

    if (!match) {
      throw new UnauthorizedError('Missing Bearer authentication header');
    }

    return match[1];
  }

  private async validateToken(token: string): Promise<AuthTokenPayload> {
    return this.jwtService.verify<AuthTokenPayload>(token);
  }

  private async getUserFromToken(token: string): Promise<User> {
    let id: string;

    try {
      ({id} = await this.validateToken(token));
    } catch (err) {
      throw new UnauthorizedError('Invalid authentication token');
    }

    return this.userRepo.findOneOrFail(id);
  }

  async isAuthenticated(context: Context): Promise<User> {
    const authorizationHeader = context.request.headers.authorization;
    const token = this.getTokenFromHeader(authorizationHeader);

    return this.getUserFromToken(token);
  }

  async login(email: string, password: string): Promise<string> {
    let user: User;

    try {
      user = await this.userRepo.findOneOrFail({where: {email}});
    } catch (err) {
      throw new BadRequestError('E-mail not registered');
    }

    if (!(await user.checkPassword(password))) {
      throw new BadRequestError('Invalid password');
    }

    return this.jwtService.sign({id: user.id}, '30d');
  }

  async logout(context: KoaContext): Promise<void> {
    const token = this.getTokenFromHeader(context.headers.authorization);

    // TODO: Logout implementation

    console.error(`> Peding invalidation of ${token}`);
  }
}
