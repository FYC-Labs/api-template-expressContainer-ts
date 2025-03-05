FROM  --platform=linux/amd64 node:20.0.0

WORKDIR /usr/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3001

CMD npx prisma generate && ts-node-dev --inspect --transpile-only --exit-child --ignore-watch node_modules -r tsconfig-paths/register src/system/infra/http/server.ts
