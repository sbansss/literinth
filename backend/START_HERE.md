# 🎉 LiteRinth Backend - Готов к использованию!

## 📦 Что внутри

Полноценный бэкенд для платформы схематиков Minecraft на **Encore.ts** с:

✅ **Better Auth** - современная авторизация (email/password, сессии, JWT)  
✅ **Prisma ORM** - type-safe работа с базой данных  
✅ **PostgreSQL** - надежная база данных  
✅ **TypeScript** - полная типизация  
✅ **Тестовые данные** - seed скрипт с готовыми данными  
✅ **Docker** - быстрый запуск PostgreSQL  
✅ **API примеры** - готовые HTTP запросы для тестирования  

## 🚀 Быстрый старт (5 минут)

### 1. Установите Encore CLI

**macOS/Linux:**
```bash
curl -L https://encore.dev/install.sh | bash
```

**Windows (PowerShell):**
```bash
iwr https://encore.dev/install.ps1 | iex
```

### 2. Перейдите в директорию проекта

```bash
cd literinth-backend
```

### 3. Установите зависимости

```bash
npm install
```

### 4. Запустите PostgreSQL

**Вариант A: Docker (рекомендуется)**
```bash
docker-compose up -d
```

**Вариант B: Локальный PostgreSQL**
```bash
# macOS
brew install postgresql@16
brew services start postgresql@16

# Linux
sudo apt install postgresql
sudo systemctl start postgresql

# Создайте БД
createdb literinth
```

**Вариант C: Neon (облачная БД)**
1. Зарегистрируйтесь на [neon.tech](https://neon.tech)
2. Создайте проект
3. Скопируйте connection string
4. Обновите `.env`:
```env
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/literinth?sslmode=require"
```

### 5. Примените миграции

```bash
npm run migrate
```

### 6. Заполните тестовыми данными

```bash
npm run seed
```

Это создаст:
- 2 тестовых пользователя
- 8 категорий с подкатегориями
- 15 схематиков
- Теги и лайки

### 7. Запустите сервер

```bash
npm run dev
```

🎉 **Готово!** API запущен на `http://localhost:4000`

## 🧪 Быстрое тестирование

### Тестовые аккаунты

```
Email: alexey@literinth.com
Password: password123

Email: ivan@literinth.com
Password: password123
```

### Попробуйте API

```bash
# Получить схематики
curl http://localhost:4000/schematics

# Получить категории
curl http://localhost:4000/categories

# Войти
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alexey@literinth.com",
    "password": "password123"
  }'
```

Или используйте файл `api-examples.http` с VS Code REST Client расширением!

## 📚 Документация

- **[QUICKSTART.md](./QUICKSTART.md)** - Быстрый старт (5 минут)
- **[README.md](./README.md)** - Полная документация
- **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)** - Подключение фронтенда
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Структура проекта
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Чеклист для деплоя
- **[api-examples.http](./api-examples.http)** - HTTP запросы для тестирования

## 📁 Структура проекта

```
literinth-backend/
├── auth/                       # Авторизация (register, login, logout, me)
├── categories/                 # Категории и подкатегории
├── schematics/                 # Схематики (CRUD, like, download)
├── middleware/                 # Middleware (auth проверка)
├── prisma/                     # Prisma ORM (schema, seed)
├── .vscode/                    # VS Code конфигурация
├── db.ts                       # Prisma Client
├── encore.app                  # Encore конфигурация
├── docker-compose.yml          # PostgreSQL в Docker
└── api-examples.http           # Примеры API запросов
```

## 🔌 API Endpoints

### 🔐 Авторизация
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход (получить токен)
- `GET /auth/me` - Текущий пользователь (требует auth)
- `POST /auth/logout` - Выход (требует auth)

### 📁 Категории
- `GET /categories` - Все категории с подкатегориями
- `GET /categories/:slug` - Одна категория

### 📦 Схематики
- `GET /schematics` - Список (фильтры: category, subcategory, search, sort, page)
- `GET /schematics/:id` - Один схематик
- `POST /schematics` - Создать (требует auth)
- `POST /schematics/:id/like` - Лайк/убрать лайк (требует auth)
- `POST /schematics/:id/download` - Скачать файл

## 🛠️ Полезные команды

```bash
npm run dev              # Запуск dev сервера
npm run build            # Production build
npm run migrate          # Создать миграцию
npm run migrate:deploy   # Применить миграции (production)
npm run generate         # Генерация Prisma Client
npm run studio           # Prisma Studio (UI для БД)
npm run seed             # Заполнить БД тестовыми данными
```

## 🎯 Следующие шаги

1. **Подключите фронтенд** - см. [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)
2. **Настройте production** - см. [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
3. **Изучите API** - откройте [api-examples.http](./api-examples.http) в VS Code

## 💡 Полезные ссылки

- [Encore.ts Documentation](https://encore.dev/docs)
- [Better Auth Documentation](https://better-auth.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🐛 Проблемы?

### Encore command not found
**Решение:** Перезапустите терминал после установки Encore CLI

### Cannot connect to database
**Решение:** Проверьте что PostgreSQL запущен и `DATABASE_URL` правильный

### Миграции не применяются
**Решение:**
```bash
npx prisma migrate reset  # Осторожно! Очистит БД
npm run migrate
npm run seed
```

## 📄 Лицензия

MIT

---

**Создано для LiteRinth** 🎮 - платформы схематиков и механизмов Minecraft

✨ **Удачи с разработкой!**
