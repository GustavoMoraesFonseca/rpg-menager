FROM node:22-alpine as builder
WORKDIR /app
COPY package.json /app
RUN npm install --silent
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]