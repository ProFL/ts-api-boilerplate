/* eslint-disable @typescript-eslint/no-explicit-any */
import * as bcrypt from 'bcrypt';
import {Service} from 'typedi';

@Service()
export default class BcryptService {
  async hash(data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(data, 10, (err, encrypted) => {
        if (err) return reject(err);
        return resolve(encrypted);
      });
    });
  }

  async compare(data: any, encrypted: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(data, encrypted, (err, same) => {
        if (err) return reject(err);
        return resolve(same);
      });
    });
  }
}
