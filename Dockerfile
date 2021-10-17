FROM node:14.17
WORKDIR /home/app
COPY . ./
RUN yarn
RUN yarn build
EXPOSE 3333
CMD ["node","dist/src/main.js"]