
# RUN npm install pm2 -g
# CMD ["pm2-runtime","dist/src/main.js"]

FROM node:14.17 as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:14.17-alpine3.14 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD node ./dist/src/main.js