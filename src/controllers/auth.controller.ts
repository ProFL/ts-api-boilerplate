import {Validator} from 'class-validator';
import {Context} from 'koa';
import * as _ from 'lodash';
import {
  BadRequestError,
  Body,
  Ctx,
  InternalServerError,
  JsonController,
  NotFoundError,
  Post,
} from 'routing-controllers';
import {Repository} from 'typeorm';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {AuthDto} from '../helpers/dtos/auth.dto';
import {User} from '../models/User.model';
import JwtService from '../services/jwt.service';

export interface TokenResponse {
  user: Partial<User>;
  token: string;
}

@JsonController('/auth')
export default class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly validator: Validator,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Post('/login')
  async login(
    @Ctx() ctx: Context,
    @Body({
      validate: {
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        validationError: {target: false},
      },
    })
    authInfo: AuthDto,
  ): Promise<TokenResponse | void> {
    let user: User;

    try {
      user = await this.userRepo.findOneOrFail({
        where: {email: authInfo.email},
      });
    } catch (err) {
      if (err.name === 'EntityNotFound') {
        throw new NotFoundError('User not found');
      } else {
        console.error(err);
        throw new InternalServerError('Failed to fetch user data');
      }
    }

    if (!(await user.checkPassword(authInfo.password))) {
      throw new BadRequestError('Invalid password');
    }

    await ctx.login(user);

    return {
      user: _.pick(user, ['userName', 'firstName', 'lastName', 'isAdmin']),
      token: await this.jwtService.sign(
        {
          id: user.id,
        },
        '30d',
      ),
    };
  }
}
