import {Validator, ValidatorOptions} from 'class-validator';
import * as _ from 'lodash';
import {
  BadRequestError,
  Body,
  Ctx,
  Delete,
  InternalServerError,
  JsonController,
  NotFoundError,
  Post,
} from 'routing-controllers';
import {Inject} from 'typedi';
import {Repository} from 'typeorm';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {CONSTANT_KEYS} from '../config/constants.config';
import {AuthDto} from '../helpers/dtos/auth.dto';
import {KoaContext} from '../helpers/interfaces/koa-context.interface';
import {User} from '../models/User.model';
import JwtAuthService from '../services/jwt-auth.service';

export interface TokenResponse {
  user: Partial<User>;
  token: string;
}

@JsonController('/api/v1/auth')
export default class AuthController {
  constructor(
    private readonly validator: Validator,
    private readonly authService: JwtAuthService,
    @Inject(CONSTANT_KEYS.VALIDATOR_OPTIONS)
    private readonly defaultValidatorOptions: ValidatorOptions,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Post('/login')
  async login(
    @Body({required: true})
    authInfo: AuthDto,
  ): Promise<TokenResponse | void> {
    this.validator.validateOrReject(authInfo, this.defaultValidatorOptions);

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

    const token = await this.authService.login(
      authInfo.email,
      authInfo.password,
    );

    return {
      user: _.pick(user, ['userName', 'firstName', 'lastName', 'isAdmin']),
      token,
    };
  }

  @Delete('/logout')
  async logout(@Ctx() context: KoaContext): Promise<void> {
    return this.authService.logout(context);
  }
}
