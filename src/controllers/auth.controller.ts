import {
  IsDefined,
  IsEmail,
  Length,
  validate,
  ValidationError,
  Validator,
} from 'class-validator';
import {Context} from 'koa';
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
import {User} from '../models/User.model';
import JwtService from '../services/jwt.service';

export class AuthDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @Length(6)
  password: string;

  @IsDefined()
  @Length(6)
  passwordConfirmation: string;
}

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
    @Body() authInfo: AuthDto,
  ): Promise<TokenResponse | void> {
    const validationErrors: Partial<ValidationError>[] = (await validate(
      authInfo,
    )).map(v => ({
      children: v.children,
      constraints: v.constraints,
      contexts: v.contexts,
      property: v.property,
      value: v.value,
    }));

    if (
      !this.validator.equals(authInfo.password, authInfo.passwordConfirmation)
    ) {
      validationErrors.push({
        property: 'passwordConfirmation',
        value: authInfo.passwordConfirmation,
        constraints: {
          equals: "password and passwordConfirmation didn't match",
        },
        children: [],
      });
    }

    if (validationErrors.length > 0) {
      ctx.res.setHeader('Content-Type', 'application/json');
      ctx.res.statusCode = 422;
      ctx.res.write(
        JSON.stringify({
          name: 'UnprocessableEntity',
          message: 'Schema validation error',
          errors: validationErrors,
        }),
      );
      return ctx.res.end();
    }

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
        throw new InternalServerError('Failed to access database');
      }
    }

    if (!(await user.checkPassword(authInfo.password))) {
      throw new BadRequestError('Invalid password');
    }

    await ctx.login(authInfo);

    return {
      user: {
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
      },
      token: await this.jwtService.sign(
        {
          id: user.id,
        },
        '30d',
      ),
    };
  }
}
