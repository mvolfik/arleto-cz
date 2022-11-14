FROM node:18-alpine AS builder

WORKDIR /build

COPY .npmrc package.json yarn.lock /build/
RUN yarn

COPY tsconfig.json svelte.config.js vite.config.js /build/
COPY src /build/src
COPY static /build/static
RUN yarn run build

FROM node:18-alpine

ENV NODE_ENV production
WORKDIR /app

COPY .npmrc package.json yarn.lock /app/
RUN yarn && rm -rf /tmp/* && rm -rf /usr/local/share/.cache/yarn
COPY --from=builder /build/build /app/build
COPY main.js /app/

ENTRYPOINT [ "node", "main.js" ]
