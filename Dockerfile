
# RUN npm install pm2 -g
# CMD ["pm2-runtime","dist/src/main.js"]

FROM node:14.17 as development

WORKDIR /home/app

COPY package*.json ./

RUN yarn install --only=development

COPY . .

RUN yarn build

FROM node:14.17-alpine3.14 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/app

COPY package*.json ./

RUN yarn install --only=production

COPY . .

COPY --from=development /home/app/dist ./dist

CMD node ./dist/src/main.js