# Запуск через cmd: 
- В папке проекта сделать файл .env, скопировать всё из .env.example, настроить под себя
- В папке api:
```shell
npm install
npm run migrate:up
npm run migrate:up_seeds
npm start
```
- В папке app:
```shell
npm install
npm run dev
```

# Запуск через docker: 
- В папке проекта сделать файл .env, скопировать всё из .env.example, настроить под себя
- В папке проекта: 
```shell
docker-compose up --build
```
