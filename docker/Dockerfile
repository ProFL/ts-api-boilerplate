FROM node:10-slim AS base

RUN mkdir -p /home/node/app && \
  chown -R node:node /home/node/app

USER node

WORKDIR /home/node/app

COPY --chown=node package.json .
COPY --chown=node yarn.lock .

RUN yarn install --prod

FROM base AS build

RUN yarn install

COPY --chown=node . .

RUN yarn build

FROM base

COPY --from=build /home/node/app/build ./

ENV NODE_ENV=production

CMD [ "yarn", "start" ]
