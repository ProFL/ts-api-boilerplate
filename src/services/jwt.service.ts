import * as jwt from 'jsonwebtoken';
import {Service} from 'typedi';
import getEnvSecret from '../helpers/get-env-secret.helper';

@Service()
export default class JwtService {
  private async jwtSecret(): Promise<string> {
    return getEnvSecret('SECRET_KEY');
  }

  async sign(
    payload: string | object | Buffer,
    expiry: string = '30d',
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      jwt.sign(
        payload,
        await this.jwtSecret(),
        {
          expiresIn: expiry,
        },
        (err, encoded) => {
          if (err) return reject(err);
          return resolve(encoded);
        },
      );
    });
  }

  async verify<T>(token: string): Promise<T> {
    return new Promise(async (resolve, reject) => {
      jwt.verify(token, await this.jwtSecret(), {}, (err, decoded) => {
        if (err) return reject(err);

        // @ts-ignore
        return resolve(decoded as T);
      });
    });
  }

  decode<T>(token: string): T {
    return jwt.decode(token, {complete: true, json: true}) as T;
  }
}
