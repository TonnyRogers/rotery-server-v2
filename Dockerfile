
# RUN npm install pm2 -g
# CMD ["pm2-runtime","dist/src/main.js"]

FROM node:14.17 as dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install glob rimraf

COPY . .

RUN npm run build

FROM node:14.17-alpine3.14 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

COPY --from=dev /usr/src/app/dist ./dist

CMD ["node", "dist/src/main"]