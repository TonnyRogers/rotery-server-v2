# FROM node:14.17

# WORKDIR /usr/src/app

# COPY package*.json ./
# COPY tsconfig*.json ./
# RUN npm install pm2 -g
# RUN yarn
# RUN yarn build

# COPY . .

# EXPOSE 3333

# CMD node dist/src/main.js
# CMD ["pm2-runtime","dist/src/main.js"]

FROM node:14.17 As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --only=development

COPY . .

RUN yarn build

FROM node:14.17 As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]