# 📁 Структура проекта LiteRinth Backend

## Обзор

```
literinth-backend/
├── 📁 auth/                    # Авторизация и аутентификация
│   ├── auth.ts                 # Конфигурация Better Auth
│   └── service.ts              # API endpoints (register, login, logout, me)
│
├── 📁 categories/              # Категории и подкатегории
│   └── service.ts              # API endpoints (getCategories, getCategory)
│
├── 📁 schematics/              # Схематики (основной функционал)
│   └── service.ts              # API endpoints (CRUD, like, download)
│
├── 📁 middleware/              # Middleware функции
│   └── auth.ts                 # Проверка авторизации (requireAuth, optionalAuth)
│
├── 📁 prisma/                  # Prisma ORM
│   ├── schema.prisma           # Схема базы данных
│   └── seed.ts                 # Скрипт для заполнения тестовыми данными
│
├── 📁 .vscode/                 # VS Code конфигурация
│   ├── extensions.json         # Рекомендуемые расширения
│   └── settings.json           # Настройки редактора
│
├── 📄 db.ts                    # Prisma Client (singleton)
├── 📄 encore.app               # Конфигурация Encore.ts
├── 📄 tsconfig.json            # TypeScript конфигурация
├── 📄 package.json             # npm зависимости и скрипты
│
├── 📄 .env                     # Переменные окружения (dev)
├── 📄 .env.example             # Пример .env файла
├── 📄 .env.production.example  # Пример для продакшн
│
├── 📄 .gitignore               # Git ignore правила
├── 📄 docker-compose.yml       # Docker для PostgreSQL
├── 📄 api-examples.http        # Примеры HTTP запросов
│
├── 📄 README.md                # Полная документация
├── 📄 QUICKSTART.md            # Быстрый старт (5 минут)
└── 📄 FRONTEND_INTEGRATION.md  # Гайд по подключению фронтенда
```

## Описание основных файлов

### 🔐 Авторизация (`auth/`)

**auth/auth.ts**
- Конфигурация Better Auth
- Настройка адаптера Prisma
- Параметры сессий (срок жизни, обновление)

**auth/service.ts**
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход
- `POST /auth/logout` - Выход
- `GET /auth/me` - Текущий пользователь

### 📁 Категории (`categories/`)

**categories/service.ts**
- `GET /categories` - Все категории с подкатегориями
- `GET /categories/:slug` - Одна категория по slug

### 📦 Схематики (`schematics/`)

**schematics/service.ts**
- `GET /schematics` - Список с фильтрацией и пагинацией
- `GET /schematics/:id` - Один схематик
- `POST /schematics` - Создать (требует auth)
- `POST /schematics/:id/like` - Лайк (требует auth)
- `POST /schematics/:id/download` - Скачать

### 🛡️ Middleware (`middleware/`)

**middleware/auth.ts**
- `requireAuth()` - Обязательная авторизация
- `optionalAuth()` - Опциональная авторизация

### 🗄️ База данных (`prisma/`)

**prisma/schema.prisma**
Модели:
- User - Пользователи
- Session - Сессии Better Auth
- Category - Категории
- Subcategory - Подкатегории
- Schematic - Схематики
- Tag - Теги
- SchematicTag - Связь схематиков и тегов
- SchematicLike - Лайки

**prisma/seed.ts**
- Создает тестовых пользователей
- Создает категории и подкатегории
- Создает 15 тестовых схематиков
- Создает теги и лайки

## Ключевые технологии

| Технология | Версия | Назначение |
|-----------|--------|------------|
| **Encore.ts** | 1.45+ | TypeScript backend framework |
| **Better Auth** | 1.3+ | Современная авторизация |
| **Prisma** | 6.1+ | Type-safe ORM |
| **PostgreSQL** | 16+ | Основная БД |
| **bcrypt** | 5.1+ | Хеширование паролей |
| **Zod** | 3.24+ | Валидация данных |
| **TypeScript** | 5.7+ | Типизация |

## API Endpoints Summary

### Авторизация
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход
- `POST /auth/logout` - Выход (auth)
- `GET /auth/me` - Профиль (auth)

### Категории
- `GET /categories` - Все категории
- `GET /categories/:slug` - Одна категория

### Схематики
- `GET /schematics` - Список (filter, sort, paginate)
- `GET /schematics/:id` - Детали
- `POST /schematics` - Создать (auth)
- `POST /schematics/:id/like` - Лайк (auth)
- `POST /schematics/:id/download` - Скачать

## Переменные окружения

### Development (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/literinth?schema=public"
AUTH_SECRET="literinth-super-secret-key-change-me-in-production-min-32"
AUTH_URL="http://localhost:4000"
PORT=4000
NODE_ENV=development
```

### Production (.env.production.example)
```env
DATABASE_URL="postgresql://user:password@production-host:5432/literinth?schema=public"
AUTH_SECRET="STRONG_RANDOM_SECRET_MIN_32_CHARS"
AUTH_URL="https://api.your-domain.com"
PORT=4000
NODE_ENV=production
```

## npm Scripts

```json
{
  "dev": "encore run",              // Запуск dev сервера
  "build": "encore build",          // Production build
  "test": "encore test",            // Тесты
  "migrate": "prisma migrate dev",  // Создать миграцию
  "migrate:deploy": "prisma migrate deploy", // Применить миграции
  "generate": "prisma generate",    // Генерация Prisma Client
  "studio": "prisma studio",        // Prisma Studio UI
  "seed": "tsx prisma/seed.ts"     // Заполнить БД тестовыми данными
}
```

## Модели базы данных

### User (Пользователи)
```prisma
- id: String (cuid)
- email: String (unique)
- username: String (unique)
- password: String (bcrypt hash)
- name: String? (nullable)
- avatar: String? (nullable)
- bio: String? (nullable)
- createdAt: DateTime
- updatedAt: DateTime
```

### Category (Категории)
```prisma
- id: String (cuid)
- name: String
- slug: String (unique)
- description: String? (nullable)
- icon: String? (nullable)
- order: Int
- createdAt: DateTime
- updatedAt: DateTime
```

### Schematic (Схематики)
```prisma
- id: String (cuid)
- title: String
- slug: String (unique)
- description: String
- content: String? (Text, nullable)
- imageUrl: String? (nullable)
- fileUrl: String? (nullable)
- authorId: String
- categoryId: String
- subcategoryId: String? (nullable)
- downloads: Int (default: 0)
- views: Int (default: 0)
- published: Boolean (default: true)
- createdAt: DateTime
- updatedAt: DateTime
```

## Зависимости

### Dependencies
```json
{
  "encore.dev": "^1.45.0",        // Encore.ts framework
  "@prisma/client": "^6.1.0",     // Prisma ORM client
  "better-auth": "^1.3.0",        // Better Auth
  "bcrypt": "^5.1.1",             // Хеширование паролей
  "zod": "^3.24.1"                // Валидация
}
```

### Dev Dependencies
```json
{
  "@types/bcrypt": "^5.0.2",      // Types для bcrypt
  "@types/node": "^22.10.2",      // Types для Node.js
  "prisma": "^6.1.0",             // Prisma CLI
  "tsx": "^4.19.2",               // TypeScript executor
  "typescript": "^5.7.2"          // TypeScript
}
```

## Рекомендуемые VS Code расширения

- **Encore** (`encore.encore`) - Encore.ts support
- **Prisma** (`prisma.prisma`) - Prisma схема support
- **ESLint** (`dbaeumer.vscode-eslint`) - Линтинг
- **Prettier** (`esbenp.prettier-vscode`) - Форматирование
- **REST Client** (`humao.rest-client`) - Тестирование API
- **Tailwind CSS** (`bradlc.vscode-tailwindcss`) - Tailwind поддержка (для фронтенда)

## Быстрый старт

```bash
# 1. Установить Encore CLI
curl -L https://encore.dev/install.sh | bash

# 2. Установить зависимости
npm install

# 3. Запустить PostgreSQL
docker-compose up -d

# 4. Применить миграции
npm run migrate

# 5. Заполнить тестовыми данными
npm run seed

# 6. Запустить сервер
npm run dev
```

🎉 API доступен на `http://localhost:4000`

## Полезные ссылки

- **Документация**: [README.md](./README.md)
- **Быстрый старт**: [QUICKSTART.md](./QUICKSTART.md)
- **Интеграция с фронтендом**: [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)
- **Примеры API**: [api-examples.http](./api-examples.http)

---

📝 **Создано для LiteRinth** - платформы схематиков Minecraft
