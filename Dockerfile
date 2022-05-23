FROM node:14.2.0-alpine3.11 as build
WORKDIR /app

RUN npm install --force

COPY ./package.json .
RUN npm install
COPY . .
RUN ng build

FROM nginx as runtime
COPY --from=build landingpage-quiz /usr/share/nginx/html

