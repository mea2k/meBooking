FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN cat ./package.json
RUN npm install --production --silent
COPY ./dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
