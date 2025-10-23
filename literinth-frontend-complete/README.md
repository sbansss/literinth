# LiteRinth Frontend

Фронтенд для платформы схематиков и механизмов Minecraft, полностью интегрированный с бэкендом на Encore.ts.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Файл `.env` уже создан с дефолтными настройками:

```env
NUXT_PUBLIC_API_BASE=http://localhost:4000
```

Для продакшена измените URL на адрес вашего бэкенда.

### 3. Запуск бэкенда

Перед запуском фронтенда убедитесь, что бэкенд запущен:

```bash
# В директории backend
npm run dev
```

Бэкенд должен быть доступен на `http://localhost:4000`

### 4. Запуск фронтенда

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 📦 Команды

```bash
# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр продакшен сборки
npm run preview

# Генерация статического сайта
npm run generate
```

## 🗂️ Структура проекта

```
frontend/
├── assets/
│   └── css/
│       └── main.css              # Tailwind и основные стили
├── components/
│   ├── Header.vue                # Шапка с авторизацией
│   ├── TabsNavigation.vue        # Табы категорий
│   ├── Sidebar.vue               # Боковая панель
│   ├── SearchFilters.vue         # Поиск и фильтры
│   └── SchematicCard.vue         # Карточка схематика
├── composables/
│   ├── useApi.ts                 # API клиент (интеграция с бэкендом)
│   └── useAuth.ts                # Управление авторизацией
├── pages/
│   ├── index.vue                 # Главная страница
│   ├── login.vue                 # Страница входа
│   └── register.vue              # Страница регистрации
├── plugins/
│   └── auth.client.ts            # Инициализация пользователя
├── types/
│   └── index.ts                  # TypeScript типы
├── .env                          # Переменные окружения
├── nuxt.config.ts                # Конфигурация Nuxt
├── tailwind.config.ts            # Конфигурация Tailwind
└── package.json
```

## 🔌 Интеграция с бэкендом

### API Endpoints

Фронтенд использует следующие endpoints бэкенда:

#### Авторизация
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход
- `GET /auth/me` - Получить текущего пользователя
- `POST /auth/logout` - Выход

#### Категории
- `GET /categories` - Все категории
- `GET /categories/:slug` - Категория по slug

#### Схематики
- `GET /schematics` - Список схематиков (с фильтрами и пагинацией)
- `GET /schematics/:id` - Детали схематика
- `POST /schematics` - Создать схематик (требует авторизации)
- `POST /schematics/:id/like` - Лайк/анлайк (требует авторизации)
- `POST /schematics/:id/download` - Скачать схематик

### Аутентификация

Фронтенд использует JWT токены для авторизации:

1. При успешном входе/регистрации токен сохраняется в `localStorage`
2. Токен автоматически добавляется во все запросы через заголовок `Authorization: Bearer <token>`
3. При выходе токен удаляется

## 🎨 Дизайн

### Цветовая палитра

```css
primary: #10b981 (зеленый)
primary-dark: #059669
primary-light: #34d399

dark-bg: #0f0f0f
dark-card: #1a1a1a
dark-hover: #262626
dark-border: #2a2a2a
```

### Шрифты

- **Onest** - основной шрифт (текст, описания)
- **Unbounded** - display шрифт (заголовки, логотип)
- **Space Grotesk** - monospace (цифры, статистика)

## 🔧 Основные композаблы

### useApi()

Композабл для работы с API:

```typescript
const api = useApi()

// Схематики
await api.getSchematics({ page: 1, perPage: 12, category: 'redstone' })
await api.getSchematic('id')
await api.likeSchematic('id')
await api.downloadSchematic('id')

// Категории
await api.getCategories()
await api.getCategory('slug')

// Авторизация
await api.register({ email, username, password, name })
await api.login({ email, password })
await api.logout()
await api.getCurrentUser()
```

### useAuth()

Композабл для управления авторизацией:

```typescript
const auth = useAuth()

// Состояние
auth.user.value           // Текущий пользователь (User | null)
auth.loading.value        // Загрузка (boolean)
auth.isAuthenticated.value // Авторизован ли (boolean)

// Методы
await auth.loginUser(email, password)
await auth.registerUser({ email, username, password, name })
await auth.logoutUser()
await auth.loadUser()
```

## 📱 Компоненты

### Header

Шапка сайта с авторизацией и меню пользователя.

### SchematicCard

Карточка схематика с:
- Изображением
- Названием и описанием
- Тегами
- Автором
- Статистикой (просмотры, скачивания)
- Кнопками лайка и скачивания

### Sidebar

Боковая панель с категориями и подкатегориями.

### SearchFilters

Поиск и фильтры (сортировка по популярности, дате, скачиваниям).

### TabsNavigation

Табы для переключения между типами схематиков (Редстоун, Постройки, Миры).

## 🐛 Обработка ошибок

Все ошибки API отображаются пользователю через:
- Модальные окна (для критических ошибок)
- Inline сообщения (для ошибок форм)
- Toast уведомления (для успешных операций)

## 🔐 Безопасность

- JWT токены хранятся в `localStorage` (только на клиенте)
- Все защищенные маршруты проверяют авторизацию
- CORS настроен в бэкенде
- XSS защита через правильное использование Vue директив

## 📊 Пагинация

Пагинация реализована с:
- Кнопками Назад/Вперед
- Быстрым переходом к странице
- Умным отображением номеров страниц (с многоточиями)
- Информацией о количестве результатов

## 🚀 Продакшен

### Сборка

```bash
npm run build
```

### Настройка для продакшена

1. Обновите `.env`:
```env
NUXT_PUBLIC_API_BASE=https://api.yourdomain.com
```

2. Разверните на хостинге:
   - Vercel (рекомендуется)
   - Netlify
   - AWS Amplify
   - Собственный сервер с Node.js

## 🔗 Полезные ссылки

- [Nuxt 3 Документация](https://nuxt.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Nuxt Icon](https://nuxt.com/modules/icon)
- [Backend Repository](../backend)

## 📄 Лицензия

MIT

## 🤝 Поддержка

Если у вас возникли проблемы:
1. Проверьте что бэкенд запущен и доступен
2. Проверьте консоль браузера на ошибки
3. Проверьте Network вкладку в DevTools
4. Убедитесь что все зависимости установлены

---

Создано с ❤️ для сообщества Minecraft
