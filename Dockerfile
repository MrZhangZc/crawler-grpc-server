FROM node:16

WORKDIR /app

COPY package.json yarn.lock app.js /app/
COPY util/ /app/util
COPY public/ /app/public
COPY protos/ /app/protos
COPY bin/ /app/bin
COPY app/ /app/app

RUN yarn install

CMD ["yarn", "start"]