import {Context} from 'koa';
import {BadRequestError, UnauthorizedError} from 'routing-controllers';
import {Service} from 'typedi';
import {getRepository, Repository} from 'typeorm';
import {AuthTokenPayload} from '../helpers/interfaces/auth-token-payload.interface';
import {KoaContext} from '../helpers/interfaces/koa-context.interface';
import {User} from '../entities/default/user.model';
import AuthService from './auth.service';
import JwtService from './jwt.service';

export type FullAuthTokenPayload = AuthTokenPayload & {
  iat: number;
  exp: number;
};

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

  private async getUserFromToken(token: string): Promise<User> {
    const payload = await this.getTokenPayload(token);
    const {id} = payload;
    const user = await this.userRepo.findOneOrFail(id);
    this.checkForUserChanges(user, payload);
    return user;
  }

  private checkForUserChanges(user: User, payload: FullAuthTokenPayload): void {
    // updatedAt in ms vs iat in seconds, must convert iat to ms
    if (user.updatedAt.getTime() > payload.iat * 1000) {
      throw new UnauthorizedError('Token invalidated');
    }
  }

  private async getTokenPayload(token: string): Promise<FullAuthTokenPayload> {
    try {
      return await this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedError('Invalid authentication token');
    }
  }

  private async getUserByEmail(email: string): Promise<User> {
    try {
      return await this.userRepo.findOneOrFail({where: {email}});
    } catch (err) {
      throw new BadRequestError('E-mail not registered');
    }
  }

  private async checkUserPassword(user: User, password: string): Promise<void> {
    if (!(await user.checkPassword(password))) {
      throw new BadRequestError('Invalid password');
    }
  }

  private generateToken(user: User): Promise<string> {
    const tokenPayload: AuthTokenPayload = {
      id: user.id,
      profile: {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
      },
      permissionLevel: user.permissionLevel.id,
    };
    return this.jwtService.sign(tokenPayload, '30d');
  }

  async isAuthenticated(context: Context): Promise<User> {
    const authorizationHeader = context.request.headers.authorization;
    const token = this.getTokenFromHeader(authorizationHeader);
    return this.getUserFromToken(token);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.getUserByEmail(email);
    await this.checkUserPassword(user, password);
    return this.generateToken(user);
  }

  async logout(context: KoaContext): Promise<void> {
    // Trigger change on updated at to invalidate all tokens issued before this date
    this.userRepo.save(context.state.user);
  }
}
