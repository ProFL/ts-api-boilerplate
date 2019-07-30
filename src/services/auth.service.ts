import {BadRequestError, UnauthorizedError} from 'routing-controllers';
import {Service} from 'typedi';
import {getRepository, Repository} from 'typeorm';
import {User} from '../models/User.model';
import JwtService from './jwt.service';

@Service()
export default class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private get userRepo(): Repository<User> {
    return getRepository(User);
  }

  extractTokenFromAuthHeader(header: string): string {
    const match = /^Bearer (.*)/g.exec(header);

    if (!match) {
      throw new UnauthorizedError('Missing authentication token');
    }

    return match[1];
  }

  async getUserFromToken(token: string): Promise<User> {
    let id: string;

    try {
      ({id} = await this.jwtService.verify(token));
    } catch (err) {
      throw new UnauthorizedError('Invalid authentication token');
    }

    return this.userRepo.findOneOrFail(id);
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

    return this.jwtService.sign(
      {id: user.id, uat: user.updatedAt.getTime()},
      '30d',
    );
  }

  async logout(token: string): Promise<void> {
    // TODO: Logout implementation
    console.error(`> Peding invalidation of ${token}`);
  }
}
