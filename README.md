# Қазақ Киносы — Архив казахского кино

Мультиязычный веб-архив казахского кино (kk/ru/en) с полным backend, авторизацией, комментариями, уведомлениями и загрузкой файлов.

## Tech Stack

| Компонент | Технология |
|---|---|
| Framework | Next.js 15 App Router + TypeScript |
| Стили | TailwindCSS v4 + shadcn/ui |
| Анимации | Framer Motion |
| i18n | next-intl (URL routing: /kk/, /ru/, /en/) |
| Поиск | Fuse.js (нечёткий поиск) |
| Auth | NextAuth.js v5 (JWT + роли) |
| ORM | Prisma v5 |
| БД | SQLite |
| Мониторинг | Sentry |
| Деплой | Vercel |
| CI/CD | GitHub Actions |
| Контейнер | Docker |

## Запуск локально

```bash
# 1. Установить зависимости
npm install

# 2. Настроить переменные окружения
cp .env.local.example .env.local
# Вставьте NEXTAUTH_SECRET: openssl rand -base64 32

# 3. Создать БД и применить схему
npx prisma db push

# 4. Заполнить тестовыми данными
npx prisma db seed

# 5. Запустить dev сервер
npm run dev
```

Открыть: http://localhost:3000/ru/

## Тестовые аккаунты

| Email | Пароль | Роль |
|---|---|---|
| admin@kazfilm.kz | admin123 | ADMIN |
| user@test.kz | user123 | USER |

## API Endpoints

| Метод | Путь | Описание |
|---|---|---|
| POST | /api/auth/[...nextauth] | NextAuth handlers |
| POST | /api/register | Регистрация пользователя |
| GET | /api/comments?filmSlug= | Получить комментарии |
| POST | /api/comments | Добавить комментарий (auth) |
| GET | /api/likes?filmSlug= | Счётчик лайков |
| POST | /api/likes | Toggle лайк (auth) |
| GET | /api/notifications | Уведомления пользователя (auth) |
| PATCH | /api/notifications | Отметить всё прочитанным (auth) |
| POST | /api/upload | Загрузка файла (auth, max 50MB) |

## Структура проекта

```
src/
├── app/
│   ├── api/                 # REST API routes
│   └── [locale]/            # Локализованные страницы
├── components/
│   ├── layout/              # Navbar, Footer
│   ├── films/               # FilmCard, FiltersPanel
│   ├── persons/             # PersonCard
│   ├── comments/            # CommentsSection (polling 5s)
│   ├── upload/              # FileUpload
│   └── shared/              # AnimatedSection, ShareButton, NotificationBell...
├── data/                    # Mock данные (20 фильмов, 15 персон...)
├── lib/                     # db.ts, search.ts, utils.ts
├── store/                   # Zustand (theme, filters, search)
├── types/                   # TypeScript интерфейсы
└── messages/                # Переводы kk/ru/en
```

## Архитектура

Модульная архитектура на основе Next.js App Router. Компоненты разделены по доменам (films, persons, collections). Backend реализован через Next.js API Routes. База данных SQLite + Prisma ORM. Готова к выделению в микросервисы.

## Деплой на Vercel

```bash
# Установить Vercel CLI
npm i -g vercel

# Деплой
vercel deploy

# Установить переменные окружения в Vercel Dashboard:
# NEXTAUTH_SECRET, NEXTAUTH_URL, DATABASE_URL
```

## Docker

```bash
docker build -t kazakh-cinema .
docker run -p 3000:3000 -e DATABASE_URL=file:./dev.db -e NEXTAUTH_SECRET=secret kazakh-cinema
```
