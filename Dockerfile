FROM node:14.17
WORKDIR /home/app
COPY . ./
# RUN npm install pm2 -g
RUN yarn
RUN yarn build
EXPOSE 3333
CMD ["node","dist/src/main.js"]
# CMD ["pm2-runtime","dist/src/main.js"]