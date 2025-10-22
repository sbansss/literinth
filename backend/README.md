# LiteRinth Backend

Бэкенд для платформы схематиков и механизмов Minecraft на **Encore.ts** с авторизацией через **Better Auth**, ORM **Prisma** и базой данных **PostgreSQL**.

## 🚀 Технологии

- **Encore.ts** - TypeScript фреймворк для backend
- **Better Auth** - современная система авторизации
- **Prisma** - TypeScript ORM
- **PostgreSQL** - основная база данных
- **bcrypt** - хеширование паролей
- **Zod** - валидация данных

## 📦 Установка

### 1. Установка Encore CLI

```bash
# macOS/Linux
curl -L https://encore.dev/install.sh | bash

# Windows (PowerShell)
iwr https://encore.dev/install.ps1 | iex
```

### 2. Клонирование и установка зависимостей

```bash
cd literinth-backend
npm install
```

### 3. Настройка базы данных

#### Вариант A: Локальный PostgreSQL

```bash
# Установите PostgreSQL если ещё не установлен
# macOS:
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian:
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Создайте базу данных
createdb literinth

# Или через psql:
psql -U postgres
CREATE DATABASE literinth;
\q
```

Используйте `.env` файл (уже создан):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/literinth?schema=public"
```

#### Вариант B: Neon (облачный PostgreSQL)

1. Зарегистрируйтесь на [Neon](https://neon.tech)
2. Создайте новый проект
3. Скопируйте connection string
4. Обновите `.env`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/literinth?sslmode=require"
```

### 4. Запуск миграций Prisma

```bash
# Создать и применить миграции
npm run migrate

# Или просто применить (если миграции уже есть)
npm run migrate:deploy

# Генерация Prisma Client
npm run generate
```

### 5. (Опционально) Заполнение тестовыми данными

Создайте файл `prisma/seed.ts` для seed данных или используйте Prisma Studio:

```bash
npm run studio
```

## 🏃 Запуск

### Development

```bash
npm run dev
```

Сервер запустится на `http://localhost:4000`

### Production Build

```bash
npm run build
```

## 📡 API Endpoints

### Авторизация

#### POST `/auth/register`
Регистрация нового пользователя

**Request:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "name": "John Doe" // опционально
}
```

**Response:**
```json
{
  "success": true,
  "message": "Пользователь успешно зарегистрирован",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "username": "username",
    "name": "John Doe"
  }
}
```

#### POST `/auth/login`
Вход пользователя

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Вход выполнен успешно",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "username": "username",
    "name": "John Doe",
    "avatar": null
  }
}
```

#### GET `/auth/me`
Получить данные текущего пользователя

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "...",
  "email": "user@example.com",
  "username": "username",
  "name": "John Doe",
  "avatar": null,
  "bio": null,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST `/auth/logout`
Выход пользователя

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Выход выполнен успешно"
}
```

### Категории

#### GET `/categories`
Получить все категории с подкатегориями

**Response:**
```json
{
  "categories": [
    {
      "id": "...",
      "name": "Враждебные мобы",
      "slug": "hostile-mobs",
      "description": null,
      "icon": null,
      "subcategories": [
        {
          "id": "...",
          "name": "Зомби",
          "slug": "zombies",
          "description": null,
          "categoryId": "..."
        }
      ]
    }
  ]
}
```

#### GET `/categories/:slug`
Получить одну категорию по slug

**Response:**
```json
{
  "category": {
    "id": "...",
    "name": "Враждебные мобы",
    "slug": "hostile-mobs",
    "description": null,
    "icon": null,
    "subcategories": [...]
  }
}
```

### Схематики

#### GET `/schematics`
Получить список схематиков с фильтрацией и пагинацией

**Query Parameters:**
- `page` - номер страницы (по умолчанию: 1)
- `perPage` - элементов на странице (по умолчанию: 20, макс: 100)
- `category` - slug категории для фильтрации
- `subcategory` - slug подкатегории для фильтрации
- `search` - поисковый запрос
- `sort` - сортировка: `popular`, `recent`, `downloads`, `likes` (по умолчанию: `recent`)
- `authorId` - ID автора для фильтрации

**Response:**
```json
{
  "data": [
    {
      "id": "...",
      "title": "Furnace inferno 10000",
      "slug": "furnace-inferno-10000",
      "description": "Мега супер крутая печка...",
      "imageUrl": "https://...",
      "fileUrl": "https://...",
      "author": {
        "id": "...",
        "username": "username",
        "name": "John Doe",
        "avatar": null
      },
      "category": {
        "id": "...",
        "name": "Щитпост",
        "slug": "shitpost"
      },
      "subcategory": {
        "id": "...",
        "name": "Щитпост",
        "slug": "shitpost-archive"
      },
      "tags": [
        { "id": "...", "name": "Печки", "slug": "pechki" }
      ],
      "downloads": 999000,
      "views": 50000,
      "likes": 999000,
      "createdAt": "2021-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### GET `/schematics/:id`
Получить один схематик по ID или slug

**Response:**
```json
{
  "schematic": {
    "id": "...",
    "title": "Furnace inferno 10000",
    "slug": "furnace-inferno-10000",
    "description": "Мега супер крутая печка...",
    "imageUrl": "https://...",
    "fileUrl": "https://...",
    "author": {...},
    "category": {...},
    "subcategory": {...},
    "tags": [...],
    "downloads": 999000,
    "views": 50001,
    "likes": 999000,
    "createdAt": "2021-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/schematics`
Создать новый схематик (требуется авторизация)

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Название схематика",
  "description": "Описание",
  "content": "Полное описание/инструкция",
  "imageUrl": "https://...",
  "fileUrl": "https://...",
  "categoryId": "...",
  "subcategoryId": "...",
  "tags": ["тег1", "тег2"]
}
```

**Response:**
```json
{
  "schematic": {...}
}
```

#### POST `/schematics/:id/like`
Лайкнуть/убрать лайк со схематика (требуется авторизация)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "liked": true,
  "likes": 999001
}
```

#### POST `/schematics/:id/download`
Скачать схематик (инкрементирует счетчик загрузок)

**Response:**
```json
{
  "success": true,
  "fileUrl": "https://..."
}
```

## 🗄️ База данных

### Модели Prisma

- **User** - пользователи
- **Session** - сессии (Better Auth)
- **Category** - категории
- **Subcategory** - подкатегории
- **Schematic** - схематики
- **Tag** - теги
- **SchematicTag** - связь схематиков и тегов
- **SchematicLike** - лайки схематиков

### Prisma Studio

Для визуального управления базой данных:

```bash
npm run studio
```

Откроется на `http://localhost:5555`

## 🔐 Авторизация

Проект использует **Better Auth** с поддержкой:

- Email/Password авторизация
- Безопасное хранение паролей (bcrypt)
- JWT токены в сессиях
- Middleware для защиты endpoints

### Использование авторизации в коде

```typescript
// Обязательная авторизация
import { requireAuth } from "./middleware/auth";

export const protectedEndpoint = api(
  { expose: true, method: "GET", path: "/protected", auth: true },
  async (req) => {
    const authData = await requireAuth(req);
    // authData.user - данные пользователя
    // authData.session - данные сессии
  }
);

// Опциональная авторизация
import { optionalAuth } from "./middleware/auth";

export const publicEndpoint = api(
  { expose: true, method: "GET", path: "/public" },
  async (req) => {
    const authData = await optionalAuth(req);
    // authData будет null если не авторизован
  }
);
```

## 🔧 Конфигурация

### Переменные окружения

Основные переменные в `.env`:

```env
# Database
DATABASE_URL="postgresql://..."

# Better Auth
AUTH_SECRET="min-32-chars-secret-key"
AUTH_URL="http://localhost:4000"

# App
PORT=4000
NODE_ENV=development
```

### Переключение между локальной и облачной БД

Просто измените `DATABASE_URL` в `.env`:

```env
# Локально
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/literinth?schema=public"

# Neon
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/literinth?sslmode=require"
```

После изменения выполните:

```bash
npm run migrate:deploy
npm run generate
```

## 🧪 Тестирование

```bash
npm run test
```

## 📚 Документация

- [Encore.ts](https://encore.dev/docs)
- [Better Auth](https://better-auth.com)
- [Prisma](https://www.prisma.io/docs)

## 🚀 Деплой

### Encore Cloud

```bash
# Подключите репозиторий к Encore Cloud
encore app create

# Настройте секреты
encore secret set AUTH_SECRET
encore secret set DATABASE_URL

# Деплой
git push encore main
```

## 📝 TODO

- [ ] Загрузка файлов (S3/Cloudflare R2)
- [ ] Email верификация
- [ ] OAuth провайдеры (Google, Discord)
- [ ] Комментарии к схематикам
- [ ] Уведомления
- [ ] Admin панель
- [ ] Rate limiting
- [ ] Кэширование (Redis)

## 📄 Лицензия

MIT
