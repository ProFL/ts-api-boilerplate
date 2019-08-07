import {
  BadRequestError,
  Body,
  Ctx,
  Delete,
  InternalServerError,
  JsonController,
  NotFoundError,
  Post,
  UseBefore,
  Authorized,
} from 'routing-controllers';
import {Repository} from 'typeorm';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {AuthDto} from '../helpers/dtos/auth.dto';
import {KoaContext} from '../helpers/interfaces/koa-context.interface';
import {ValidateBody} from '../middlewares/validate-body.middleware';
import {UserProfile} from '../models/user-profile.model';
import {User} from '../models/user.model';
import JwtAuthService from '../services/jwt-auth.service';

@JsonController('/api/v1/auth')
export default class AuthController {
  constructor(
    private readonly authService: JwtAuthService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Post('/')
  @UseBefore(ValidateBody(AuthDto))
  async login(
    @Body({required: true}) authInfo: AuthDto,
  ): Promise<{profile: UserProfile; token: string}> {
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
      token,
      profile: await user.profile,
    };
  }

  @Delete('/')
  @Authorized()
  async logout(@Ctx() context: KoaContext): Promise<void> {
    return this.authService.logout(context);
  }
}
