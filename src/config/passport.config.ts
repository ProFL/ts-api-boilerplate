import * as HttpErrros from 'http-errors';
import {Middleware} from 'koa';
import * as passport from 'koa-passport';
import {ExtractJwt, Strategy, VerifiedCallback} from 'passport-jwt';
import {Repository} from 'typeorm';
import {InjectRepository} from 'typeorm-typedi-extensions';
import getEnvSecret from '../helpers/get-env-secret.helper';
import {User} from '../models/User.model';

export default class PassportConfigFactory {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  async build(): Promise<Middleware> {
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await this.userRepo.findOneOrFail(id);

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    });

    passport.use(
      new Strategy(
        {
          secretOrKey: await getEnvSecret('SECRET_KEY'),
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        this.verifyAuthTokenPayload,
      ),
    );

    return passport.initialize();
  }

  async verifyAuthTokenPayload(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any,
    done: VerifiedCallback,
  ): Promise<void> {
    try {
      const {id} = payload;

      const user = await this.userRepo.findOneOrFail(id);

      return done(null, user);
    } catch (err) {
      console.error(err);
      return done(new HttpErrros.Unauthorized('Invalid token'), null);
    }
  }
}
