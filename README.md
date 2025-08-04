# BioCad Fullstack Test Task

Fullstack-приложение на базе **React + Next.js 15 (App Router) + NestJS + TypeScript + Prisma + PostgreSQL + Redis + Docker**.

## Features

- JWT авторизация (access/refresh токены)
- SSR там, где оправдано (Next.js)
- HttpOnly cookies для хранения токенов
- REST API, кэширование (Redis или память)
- Инфраструктура: Turborepo, Docker, docker-compose
- E2E тесты на Jest + Supertest
- Swagger UI

---

## Запуск проекта в Docker

> **Требования:**
>
> - Docker и Docker Compose (Compose V2, встроен в Docker Desktop)
> - 4+ GB RAM для корректной работы всего стека

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/Noizerg/biocad-fullstack.git
cd biocad-fullstack
```

### 2. Скопируйте .env

В каталоге `apps/api` должен быть файл `.env` (см. пример в `.env.example`).  
Если его нет — создайте вручную и укажите параметры для базы, JWT и пр.

### 3. Соберите и запустите сервисы

```bash
docker-compose up --build
```

- Это поднимет контейнеры:
  - **api** (NestJS backend, порт 5001)
  - **web** (Next.js frontend, порт 3000)
  - **postgres** (порт 5432)
  - **redis** (порт 6379)

### 4. Миграции Prisma (если нужно вручную)

Обычно миграция и генерация клиентских моделей происходят при запуске, но если нужно вручную:

```bash
docker-compose exec api npx prisma migrate deploy
```

---

## Доступные URL

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5001](http://localhost:5001)
- Swagger UI: [http://localhost:5001/swagger](http://localhost:5001/swagger)
- PostgreSQL: `localhost:5432`, пользователь/пароль: `postgres/postgres`
- Redis: `localhost:6379`

---

## Запуск тестов в контейнере

### 1. Поднять контейнеры (если ещё не запущены)

```bash
docker-compose up -d
```

### 2. Выполнить тесты внутри контейнера `api`

```bash
docker-compose exec api pnpm test
```

- Для e2e тестов используется Jest + Supertest.
- По умолчанию используется dev-база из контейнера `postgres`.

---

## Примеры основных команд

- **Собрать и запустить всё:**  
  `docker-compose up --build`
- **Остановить контейнеры:**  
  `docker-compose down`
- **Зайти внутрь контейнера API:**  
  `docker-compose exec api sh`
- **Запустить миграции вручную:**  
  `docker-compose exec api npx prisma migrate deploy`
- **Прогнать тесты:**  
  `docker-compose exec api pnpm test`

---

## License

SgtNick
