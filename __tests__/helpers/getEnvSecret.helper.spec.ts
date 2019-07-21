import * as path from 'path';
import * as uuid from 'uuid/v4';
import * as os from 'os';
import getEnvSecret from '../../src/helpers/get-env-secret.helper';

describe('getEnvSecret(key)', function () {
  test('should throw an error on a unavailable key', async () => {
    const key = uuid();
    try {
      const secret = await getEnvSecret(key);
      expect(secret).toBe(undefined);
    } catch (err) {
      expect(err.code).toBe('ENOENT');
      expect(err.syscall).toBe('open');

      switch (os.platform()) {
        case 'linux':
          expect(err.errno).toBe(-2);
          expect(err.path).toBe(path.join('/', 'run', 'secrets', key));
          break;
        case 'win32':
          expect(err.errno).toBe(-4058);
          expect(err.path).toMatch(new RegExp(`\\${key}$`));
          break;
      }
    }
  });

  test('should succeed on a available environment variable', async () => {
    const secret = await getEnvSecret('NODE_ENV');
    expect(secret).not.toBe('production');
  });

  test.todo('should succeed on a available environment secret');
});
