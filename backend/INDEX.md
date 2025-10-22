# 📚 LiteRinth Backend - Навигация по документации

## 🚀 Начните здесь

### Для быстрого старта (рекомендуется)
1. **[START_HERE.md](./START_HERE.md)** ⭐ - Главная точка входа
2. **[QUICKSTART.md](./QUICKSTART.md)** ⚡ - Запуск за 5 минут

### Полная документация
3. **[README.md](./README.md)** 📖 - Подробная документация проекта

## 📁 Структура и архитектура

4. **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** 🏗️ - Описание структуры файлов
5. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** 📊 - Сводка и статистика проекта
6. **[ARCHITECTURE.md](./ARCHITECTURE.md)** 🎨 - Диаграммы архитектуры

## 🔌 Интеграция и развертывание

7. **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)** 🎯 - Подключение Nuxt 3 фронтенда
8. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** ✅ - Чеклист для production

## 🧪 Тестирование API

9. **[api-examples.http](./api-examples.http)** 🔍 - Готовые HTTP запросы для всех endpoints

## 📂 Исходный код

### Сервисы (API endpoints)
- **[auth/service.ts](./auth/service.ts)** - Авторизация (register, login, logout, me)
- **[categories/service.ts](./categories/service.ts)** - Категории
- **[schematics/service.ts](./schematics/service.ts)** - Схематики (CRUD, like, download)

### Конфигурация
- **[auth/auth.ts](./auth/auth.ts)** - Better Auth config
- **[middleware/auth.ts](./middleware/auth.ts)** - Auth middleware
- **[db.ts](./db.ts)** - Prisma Client

### База данных
- **[prisma/schema.prisma](./prisma/schema.prisma)** - Схема БД (8 моделей)
- **[prisma/seed.ts](./prisma/seed.ts)** - Тестовые данные

### Настройки
- **[.env](./.env)** - Переменные окружения (dev)
- **[.env.example](./.env.example)** - Пример .env
- **[.env.production.example](./.env.production.example)** - Пример для production
- **[package.json](./package.json)** - npm зависимости
- **[tsconfig.json](./tsconfig.json)** - TypeScript конфиг
- **[encore.app](./encore.app)** - Encore.ts конфиг
- **[docker-compose.yml](./docker-compose.yml)** - PostgreSQL в Docker

## 📋 Краткая информация

### Что внутри
- ✅ **Better Auth** - авторизация email/password
- ✅ **Prisma ORM** - type-safe работа с БД
- ✅ **PostgreSQL** - база данных
- ✅ **8 моделей данных** - готовая схема
- ✅ **13 API endpoints** - полный CRUD
- ✅ **Тестовые данные** - seed скрипт
- ✅ **Docker** - быстрый запуск PostgreSQL

### Технологии
- Encore.ts 1.45+
- Better Auth 1.3+
- Prisma 6.1+
- PostgreSQL 16+
- TypeScript 5.7+

### API Endpoints
**Авторизация:**
- POST /auth/register
- POST /auth/login
- GET /auth/me
- POST /auth/logout

**Категории:**
- GET /categories
- GET /categories/:slug

**Схематики:**
- GET /schematics
- GET /schematics/:id
- POST /schematics
- POST /schematics/:id/like
- POST /schematics/:id/download

## 🎯 Типичные задачи

### Я хочу быстро запустить проект
→ Читайте **[QUICKSTART.md](./QUICKSTART.md)**

### Я хочу подключить фронтенд
→ Читайте **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)**

### Я хочу развернуть в production
→ Читайте **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**

### Я хочу протестировать API
→ Используйте **[api-examples.http](./api-examples.http)**

### Я хочу понять архитектуру
→ Читайте **[ARCHITECTURE.md](./ARCHITECTURE.md)**

### Я хочу изучить код
→ Начните с **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**

## 🛠️ Команды npm

```bash
npm run dev              # Запуск dev сервера
npm run build            # Production build
npm run migrate          # Создать миграцию
npm run migrate:deploy   # Применить миграции
npm run generate         # Prisma Client
npm run studio           # Prisma Studio
npm run seed             # Тестовые данные
```

## 📊 Статистика

- **Файлов:** 26
- **Документации:** 9 файлов
- **Исходного кода:** 10 файлов
- **Конфигурации:** 7 файлов
- **Размер:** ~99 KB
- **Архив:** 24 KB

## 🎁 Что включено

### Документация
- [x] Быстрый старт
- [x] Полная документация
- [x] Гайд по интеграции
- [x] Архитектура с диаграммами
- [x] Чеклист для деплоя
- [x] Примеры API запросов

### Код
- [x] Авторизация (Better Auth)
- [x] API endpoints (13 штук)
- [x] Middleware (auth)
- [x] Prisma схема (8 моделей)
- [x] Seed скрипт

### Настройки
- [x] TypeScript конфигурация
- [x] Encore.ts конфигурация
- [x] Docker Compose
- [x] VS Code настройки
- [x] Git ignore

## 💡 Полезные ссылки

- [Encore.ts Docs](https://encore.dev/docs)
- [Better Auth Docs](https://better-auth.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## 🆘 Нужна помощь?

1. **Ошибки при запуске** → см. раздел Troubleshooting в [QUICKSTART.md](./QUICKSTART.md)
2. **Проблемы с БД** → см. [README.md](./README.md#база-данных)
3. **Вопросы по API** → см. [api-examples.http](./api-examples.http)
4. **Интеграция** → см. [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)

## ✨ Следующие шаги

1. **Прочитайте** [START_HERE.md](./START_HERE.md)
2. **Запустите** проект по [QUICKSTART.md](./QUICKSTART.md)
3. **Протестируйте** API с помощью [api-examples.http](./api-examples.http)
4. **Подключите** фронтенд по [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)
5. **Разверните** в production по [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

**🎮 Удачи с разработкой LiteRinth!**

*Платформа схематиков и механизмов Minecraft*
