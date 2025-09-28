FROM node:19.6.0-alpine as builder
WORKDIR /app
COPY package.json /app
RUN npm install --silent
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]