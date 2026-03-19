FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --non-interactive --network-timeout 600000

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]
