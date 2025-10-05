ARG NODE_VERSION=24.7.0-alpine
ARG NGINX_VERSION=alpine3.22

FROM node:${NODE_VERSION} AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --silent
COPY . .
RUN npm run build --prod

FROM nginx:${NGINX_VERSION}
VOLUME /var/cache/nginx
COPY --from=build /app/dist/rpg-menager/browser /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf