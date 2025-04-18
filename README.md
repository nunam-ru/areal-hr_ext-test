# areal-hr_ext-test

#### Windows 10 + VSCode + PostgreSQL 17 Docker

![diagram image](https://github.com/nunam-ru/areal-hr_ext-test/blob/main/docs/diagram.png)

## Структура проекта

```plaintext
areal-hr_ext-test/
├── /api/................................
│   ├── /node_modules/...................
│   ├── /migrations/.....................
├── /app/................................
│   ├── /node_modules/...................
├── /containers/.........................
│   ├── /api/............................
│   │   ├── Dockerfile...................
│   ├── /app/............................
│   │   ├── Dockerfile...................
├── /docs/...............................
├── /.gitignore..........................
├── /.env................................
├── /.env.example........................
├── /docker-compose.yml..................
├── /README.md/..........................
```

- Инициализация репозитория: git init
- Добавление изменений: git add .
- Коммит: git commit -m "msg"
- Просмотр состояния репозитория: git status
- Просмотр истории коммитов: git log
- Создание новой ветки: git branch branch-name
- Переключение на ветку: git checkout branch-name
- Слияние веток: git merge branch-name
- Отправка изменений: git push origin branch-name
