FROM node:alpine as build

WORKDIR /app

ARG VITE_API_URL

ENV VITE_API_URL=${VITE_API_URL}

COPY app/package.json package.json
RUN npm install
COPY /app .
RUN npm run build

FROM nginx:stable-perl
COPY --from=build app/dist /usr/share/nginx/html
COPY --from=build app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE ${APP_PORT}

CMD ["nginx", "-g", "daemon off;"]