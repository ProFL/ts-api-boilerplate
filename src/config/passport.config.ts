import {Handler} from 'express';
import * as HttpErrros from 'http-errors';
import * as passport from 'passport';
import {ExtractJwt, Strategy, VerifyCallback} from 'passport-jwt';
import getEnvSecret from '../helpers/get-env-secret.helper';
import getRepository from '../helpers/get-repository.helper';
import {User} from '../models/User.model';

export const verifyAuthTokenPayload: VerifyCallback = async (payload, done) => {
  try {
    const {id} = payload;
    const userRepo = getRepository(User);

    const user = await userRepo.findOneOrFail(id);

    return done(null, user);
  } catch (err) {
    console.error(err);
    return done(new HttpErrros.Unauthorized('Invalid token'), null);
  }
};

export default async function passportConfig(): Promise<Handler> {
  passport.deserializeUser(async (id, done) => {
    try {
      const userRepo = getRepository(User);

      const user = await userRepo.findOneOrFail(id);

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
      verifyAuthTokenPayload,
    ),
  );

  return passport.initialize();
}
