# 🚀 Быстрый старт

## 1️⃣ Установка и запуск (5 минут)

### Шаг 1: Установите Encore CLI
```bash
# macOS/Linux
curl -L https://encore.dev/install.sh | bash

# Windows
iwr https://encore.dev/install.ps1 | iex
```

### Шаг 2: Установите зависимости
```bash
cd literinth-backend
npm install
```

### Шаг 3: Запустите PostgreSQL
```bash
# Если уже установлен:
# macOS
brew services start postgresql@16

# Linux
sudo systemctl start postgresql

# Или используйте Docker:
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

### Шаг 4: Создайте базу данных
```bash
createdb literinth
# или
docker exec -it postgres createdb -U postgres literinth
```

### Шаг 5: Настройте .env (уже создан!)
Файл `.env` уже настроен для локальной разработки. Если нужно, отредактируйте:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/literinth?schema=public"
```

### Шаг 6: Примените миграции
```bash
npm run migrate
```

### Шаг 7: Заполните тестовыми данными
```bash
npm run seed
```

Это создаст:
- 2 тестовых пользователя
- 8 категорий с подкатегориями
- 15 схематиков
- Теги и лайки

**Тестовые аккаунты:**
```
Email: alexey@literinth.com
Password: password123

Email: ivan@literinth.com
Password: password123
```

### Шаг 8: Запустите сервер
```bash
npm run dev
```

🎉 **Готово!** API доступен на `http://localhost:4000`

---

## 2️⃣ Быстрое тестирование API

### Регистрация
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "name": "Test User"
  }'
```

### Вход
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alexey@literinth.com",
    "password": "password123"
  }'
```

Сохраните `token` из ответа!

### Получить схематики
```bash
curl http://localhost:4000/schematics?page=1&perPage=10
```

### Получить категории
```bash
curl http://localhost:4000/categories
```

### Получить текущего пользователя (требуется токен)
```bash
curl http://localhost:4000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 3️⃣ Использование с Neon (облачная БД)

Если не хотите устанавливать PostgreSQL локально:

1. Зарегистрируйтесь на [neon.tech](https://neon.tech)
2. Создайте проект
3. Скопируйте connection string
4. Обновите `.env`:
```env
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/literinth?sslmode=require"
```
5. Запустите миграции:
```bash
npm run migrate:deploy
npm run seed
```

---

## 4️⃣ Полезные команды

```bash
# Запуск dev сервера
npm run dev

# Prisma Studio (UI для БД)
npm run studio

# Создать новую миграцию
npm run migrate

# Применить миграции (продакшн)
npm run migrate:deploy

# Перегенерировать Prisma Client
npm run generate

# Заполнить БД тестовыми данными
npm run seed

# Билд для продакшна
npm run build
```

---

## 5️⃣ Структура проекта

```
literinth-backend/
├── auth/
│   ├── auth.ts         # Конфигурация Better Auth
│   └── service.ts      # API endpoints авторизации
├── categories/
│   └── service.ts      # API endpoints категорий
├── schematics/
│   └── service.ts      # API endpoints схематиков
├── middleware/
│   └── auth.ts         # Middleware для авторизации
├── prisma/
│   ├── schema.prisma   # Схема БД
│   └── seed.ts         # Seed скрипт
├── db.ts               # Prisma Client
├── .env                # Переменные окружения
├── encore.app          # Конфигурация Encore
└── package.json
```

---

## 🐛 Troubleshooting

### Проблема: "Cannot connect to database"
**Решение:** Проверьте что PostgreSQL запущен и `DATABASE_URL` правильный

### Проблема: "Encore command not found"
**Решение:** Перезапустите терминал после установки Encore CLI

### Проблема: "Module not found"
**Решение:** Запустите `npm install`

### Проблема: Миграции не применяются
**Решение:** 
```bash
npx prisma migrate reset  # Осторожно! Очистит БД
npm run migrate
npm run seed
```

---

## 📖 Дополнительно

- [Полная документация](./README.md)
- [Encore.ts Docs](https://encore.dev/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Better Auth Docs](https://better-auth.com)

---

**Вопросы?** Откройте issue или свяжитесь с командой!
