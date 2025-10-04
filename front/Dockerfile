FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

FROM nginx:alpine AS production
COPY --from=build /app/dist/rpg-menager /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]