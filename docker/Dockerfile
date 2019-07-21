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

RUN export NODE_ENV=test && \
  export SECRET_KEY=test && \
  yarn test:cov && \
  yarn build

FROM base

COPY --from=build /home/node/app/build ./

ENV NODE_ENV=production SECRET_KEY=r3pl4c3_m3

CMD [ "yarn", "start" ]
