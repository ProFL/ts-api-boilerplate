import * as fs from 'fs';
import * as path from 'path';
import {promisify} from 'util';

const readFileAsync = promisify(fs.readFile);

const secretBuffer: {[key: string]: string} = {};

/**
 * Returns an environment variable if available,
 * otherwise returns the value of a Docker secret
 * and at last fails if none is available
 *
 * Uses memoization strategy to speed up secret loading
 *
 * @param key The secret's key
 * @returns The secret's value
 */
export default async function getEnvSecret(key: string): Promise<string> {
  if (Object.keys(process.env).includes(key)) {
    return process.env[key];
  }

  if (!Object.keys(secretBuffer).includes(key)) {
    const secretPath = path.join('/', 'run', 'secrets', key);
    const secret = await readFileAsync(secretPath, 'utf-8');

    secretBuffer[key] = secret;
  }

  return secretBuffer[key];
}
