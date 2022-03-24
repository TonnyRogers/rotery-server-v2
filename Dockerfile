FROM node:14.17

WORKDIR /usr/src/app

COPY package*.json ./
# RUN npm install pm2 -g
RUN yarn
RUN yarn build

COPY . .

EXPOSE 3333

CMD ["node","dist/src/main.js"]
# CMD ["pm2-runtime","dist/src/main.js"]