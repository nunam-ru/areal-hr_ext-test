FROM node:alpine as build

WORKDIR /docs

COPY /docs/package.json package.json
RUN npm install
COPY /docs .
RUN npm run docs:build

FROM nginx:stable-perl
COPY --from=build docs/.vitepress/dist /usr/share/nginx/html
COPY --from=build docs/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE ${DOCS_PORT}

CMD ["nginx", "-g", "daemon off;"]