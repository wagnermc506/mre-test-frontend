FROM node:24 AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

CMD yarn dev --host
