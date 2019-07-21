import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import {Router} from 'express';

class FS {
  static readDir = util.promisify(fs.readdir);

  static stat = util.promisify(fs.stat);
}

const controllerClasses = [];

async function bfsControllerSearch(
  basePath: string = __dirname,
): Promise<void> {
  const controllerDirContents = await FS.readDir(basePath);

  const dirs = [];

  await Promise.all(
    controllerDirContents.map(dirContent => {
      return new Promise(async (resolve, reject) => {
        try {
          const stats = await FS.stat(path.resolve(__dirname, dirContent));

          if (stats.isFile()) {
            if (/\.controller\.(j|t)s$/.test(dirContent)) {
              // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
              const required = require(path.resolve(__dirname, dirContent));
              controllerClasses.push(
                required.default ? required.default : required,
              );
            }
          }

          if (stats.isDirectory()) {
            dirs.push(dirContent);
          }

          resolve();
        } catch (err) {
          reject(err);
        }
      });
    }),
  );

  await Promise.all(
    dirs.map(dir => bfsControllerSearch(path.resolve(basePath, dir))),
  );
}

export default async function getControllers(): Promise<Router[]> {
  await bfsControllerSearch();

  return controllerClasses.map(CC => new CC().loadRoutes());
}
