# LiteRinth Frontend

Фронтенд для платформы схематиков и механизмов Minecraft.

## 🚀 Технологии

- **Nuxt 3** - Vue.js фреймворк
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация (темная тема + зеленые акценты)
- **Nuxt Icon** - иконки из Iconify (используются Heroicons)
- **Google Fonts** - кастомные шрифты (Onest, Unbounded, Space Grotesk)

## 📦 Установка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр продакшен сборки
npm run preview
```

## 🗂️ Структура проекта

```
literinth-frontend/
├── assets/
│   └── css/
│       └── main.css          # Основные стили и Tailwind
├── components/
│   ├── Header.vue            # Шапка сайта
│   ├── TabsNavigation.vue    # Табы (Редстоун, Постройки, Миры)
│   ├── Sidebar.vue           # Боковая панель с категориями
│   ├── SearchFilters.vue     # Поиск и фильтры
│   └── SchematicCard.vue     # Карточка схематика
├── composables/
│   └── useApi.ts             # Композабл для работы с API
├── pages/
│   └── index.vue             # Главная страница
├── types/
│   └── index.ts              # TypeScript типы
├── app.vue                   # Корневой компонент
├── nuxt.config.ts            # Конфигурация Nuxt
├── tailwind.config.ts        # Конфигурация Tailwind
└── package.json
```

## 🔌 Подключение бэкенда

### Текущее состояние

Сейчас приложение использует **моковые данные** для разработки. Все данные генерируются в `composables/useApi.ts`.

### Как подключить реальный API

1. **Создайте файл `.env` в корне проекта:**

```env
# URL вашего API бэкенда
NUXT_PUBLIC_API_BASE=http://localhost:3001/api
```

2. **Обновите `nuxt.config.ts`:**

```typescript
export default defineNuxtConfig({
  // ... остальная конфигурация
  
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  }
})
```

3. **Замените моковые функции в `composables/useApi.ts` на реальные запросы:**

```typescript
// Пример реального запроса
const getSchematics = async (params?: {
  page?: number
  perPage?: number
  category?: string
  subcategory?: string
  search?: string
  sort?: string
}): Promise<PaginatedResponse<Schematic>> => {
  const config = useRuntimeConfig()
  const queryParams = new URLSearchParams()
  
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.perPage) queryParams.append('perPage', params.perPage.toString())
  if (params?.category) queryParams.append('category', params.category)
  if (params?.subcategory) queryParams.append('subcategory', params.subcategory)
  if (params?.search) queryParams.append('search', params.search)
  if (params?.sort) queryParams.append('sort', params.sort)
  
  const response = await fetch(
    `${config.public.apiBase}/schematics?${queryParams.toString()}`
  )
  
  if (!response.ok) {
    throw new Error('Ошибка загрузки схематиков')
  }
  
  return await response.json()
}
```

## 📡 API Endpoints (ожидаемые)

Фронтенд ожидает следующие эндпоинты от бэкенда:

### Схематики

```
GET /api/schematics
  Query params: page, perPage, category, subcategory, search, sort
  Response: {
    data: Schematic[],
    pagination: { page, perPage, total, totalPages }
  }

GET /api/schematics/:id
  Response: Schematic
```

### Категории

```
GET /api/categories
  Response: Category[]
```

### Пользователь

```
GET /api/user/current
  Response: User | null

POST /api/auth/login
  Body: { username, password }
  Response: { success, message, data: User }
```

## 🎨 Дизайн

### Цветовая палитра

- **Фон:** `#0f0f0f` (dark-bg)
- **Карточки:** `#1a1a1a` (dark-card)
- **Hover:** `#262626` (dark-hover)
- **Границы:** `#2a2a2a` (dark-border)
- **Акцент:** `#10b981` (зеленый)

### Типографика

- **Onest** - основной шрифт (текст, описания, кнопки)
- **Unbounded** - заголовки, логотип, названия схематиков
- **Space Grotesk** - цифры, статистика, технические данные

### Компоненты

Все компоненты используют темную тему и следуют дизайну из скриншота.

## 🔧 Настройка

### Добавление новых категорий

Обновите функцию `getMockCategories()` в `composables/useApi.ts` или получайте категории из API.

### Изменение количества элементов в сетке

Откройте `pages/index.vue` и измените классы grid:

```vue
<!-- 2 колонки на средних экранах, 3 на больших -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

<!-- Или 4 колонки на очень больших экранах -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```

### Использование иконок

Проект использует `@nuxt/icon` для отображения иконок. По умолчанию используются Heroicons:

```vue
<!-- Пример использования иконки -->
<Icon name="heroicons:heart" class="w-5 h-5" />
<Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
```

Вы можете использовать любые иконки из [Iconify](https://icon-sets.iconify.design/):

```vue
<!-- Material Design Icons -->
<Icon name="mdi:heart" />

<!-- Font Awesome -->
<Icon name="fa6-solid:download" />

<!-- Lucide -->
<Icon name="lucide:heart" />
```

### Использование шрифтов

Проект использует три кастомных шрифта из Google Fonts:

**1. Onest** - основной шрифт для текста
```vue
<!-- Применяется автоматически ко всему тексту -->
<p class="text-gray-300">Обычный текст</p>
```

**2. Unbounded** - display шрифт для заголовков и логотипа
```vue
<!-- Применяется через класс font-display -->
<h1 class="font-display">Заголовок</h1>
<h2 class="font-bold font-display">LiteRinth</h2>
```

**3. Space Grotesk** - monospace шрифт для статистики и чисел
```vue
<!-- Применяется через класс font-mono -->
<div class="font-mono">999M загрузок</div>
<span class="font-mono">10:30</span>
```

Все шрифты уже настроены в `tailwind.config.ts`:
- `font-sans` → Onest (по умолчанию)
- `font-display` → Unbounded
- `font-mono` → Space Grotesk

## 📝 TypeScript типы

Все основные типы данных находятся в `types/index.ts`:

- `Schematic` - схематик/механизм
- `Category` - категория
- `Subcategory` - подкатегория
- `User` - пользователь
- `ApiResponse` - обертка для API ответов
- `PaginatedResponse` - пагинированные данные

## 🚧 TODO для подключения бэкенда

- [ ] Создать `.env` файл с URL API
- [ ] Заменить моковые функции в `useApi.ts` на реальные запросы
- [ ] Добавить обработку ошибок API
- [ ] Добавить loading состояния
- [ ] Реализовать аутентификацию
- [ ] Добавить сохранение токена в localStorage/cookie
- [ ] Добавить страницу детального просмотра схематика
- [ ] Добавить страницу профиля пользователя

## 📄 Лицензия

MIT
