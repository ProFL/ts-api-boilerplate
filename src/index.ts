import 'reflect-metadata';

import appConfig from './config/app.config';
import getEnvSecret from './helpers/get-env-secret.helper';

appConfig().then(async app => {
  let port: number;

  try {
    port = parseInt(await getEnvSecret('PORT'), 10);
  } catch (err) {
    port = 3000;
  }

  app.listen(port, () => console.log(`Listening on ${port}`));
});
