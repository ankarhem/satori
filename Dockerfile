FROM node:lts-alpine as build
RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm --frozen-lockfile --store-dir .pnpm i

COPY . .
RUN pnpm build


FROM node:lts-alpine as deploy
RUN npm install -g pnpm

WORKDIR /usr/src/app
ENV NODE_ENV production

COPY package.json pnpm-lock.yaml ./

RUN pnpm --frozen-lockfile --production --store-dir .pnpm i

COPY --from=build /usr/src/app/dist ./dist

ENTRYPOINT ["node", "/usr/src/app/dist/index.js"]