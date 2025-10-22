# 🎨 Руководство по шрифтам

## Доступные шрифты

### 1. **Onest** - Основной шрифт (`font-sans`)
Современный, читаемый шрифт для основного контента.

**Где используется:**
- Обычный текст
- Описания
- Навигация
- Текст кнопок
- Параграфы

**Примеры:**
```vue
<p>Обычный текст</p>
<span class="text-gray-300">Описание схематика</span>
<button class="btn-primary">Кнопка</button>
```

---

### 2. **Unbounded** - Display шрифт (`font-display`)
Жирный, выразительный шрифт для заголовков.

**Где используется:**
- Логотип LiteRinth
- Заголовки страниц
- Названия схематиков
- Названия категорий

**Примеры:**
```vue
<h1 class="font-display text-2xl">LiteRinth</h1>
<h2 class="font-display font-bold">Furnace inferno 10000</h2>
<h3 class="font-display">Категории</h3>
```

---

### 3. **Space Grotesk** - Monospace шрифт (`font-mono`)
Технический шрифт для цифр и статистики.

**Где используется:**
- Статистика (загрузки, лайки)
- Даты
- Числа
- Технические данные

**Примеры:**
```vue
<span class="font-mono">999M</span>
<div class="font-mono">Обновлено 4 года назад</div>
<p class="font-mono">10:30</p>
```

---

## Комбинации шрифтов

### Карточка схематика
```vue
<div class="card">
  <!-- Заголовок - Unbounded -->
  <h3 class="font-display font-bold text-lg">
    Furnace inferno 10000
  </h3>
  
  <!-- Описание - Onest (по умолчанию) -->
  <p class="text-gray-300">
    Мега супер крутая печка 10000 с файлваем
  </p>
  
  <!-- Статистика - Space Grotesk -->
  <div class="font-mono text-sm">
    <span>999M загрузок</span>
    <span>999M лайков</span>
  </div>
</div>
```

### Шапка сайта
```vue
<header>
  <!-- Логотип - Unbounded -->
  <h1 class="font-display text-2xl font-bold">
    LiteRinth
  </h1>
  
  <!-- Навигация - Onest (по умолчанию) -->
  <nav>
    <a>Схематики</a>
    <a>Новости</a>
  </nav>
</header>
```

---

## Настройка в Tailwind

В `tailwind.config.ts` шрифты настроены так:

```typescript
fontFamily: {
  sans: ['Onest', 'system-ui', 'sans-serif'],      // по умолчанию
  display: ['Unbounded', 'system-ui', 'sans-serif'], // font-display
  mono: ['Space Grotesk', 'monospace']               // font-mono
}
```

---

## Веса шрифтов

### Onest
- `300` - Light
- `400` - Regular
- `500` - Medium
- `600` - SemiBold
- `700` - Bold
- `800` - ExtraBold

### Unbounded
- `400` - Regular
- `500` - Medium
- `600` - SemiBold
- `700` - Bold
- `800` - ExtraBold
- `900` - Black

### Space Grotesk
- `300` - Light
- `400` - Regular
- `500` - Medium
- `600` - SemiBold
- `700` - Bold

---

## Примеры весов

```vue
<!-- Onest -->
<p class="font-light">Легкий текст</p>
<p class="font-normal">Обычный текст</p>
<p class="font-medium">Средний текст</p>
<p class="font-semibold">Полужирный текст</p>
<p class="font-bold">Жирный текст</p>

<!-- Unbounded для заголовков -->
<h1 class="font-display font-bold">Заголовок</h1>
<h2 class="font-display font-extrabold">Большой заголовок</h2>
<h3 class="font-display font-black">Очень большой</h3>

<!-- Space Grotesk для данных -->
<span class="font-mono font-medium">999M</span>
<span class="font-mono font-semibold">1,234</span>
```

---

## Рекомендации

✅ **ДЕЛАТЬ:**
- Использовать `font-display` для всех заголовков
- Использовать `font-mono` для всех цифр и статистики
- Оставлять основной текст без класса (Onest по умолчанию)

❌ **НЕ ДЕЛАТЬ:**
- Не смешивать шрифты в одном блоке текста
- Не использовать `font-display` для обычного текста
- Не использовать `font-mono` для длинных описаний

---

## Google Fonts

Шрифты загружаются из Google Fonts в `nuxt.config.ts`:

```typescript
link: [
  { 
    rel: 'stylesheet', 
    href: 'https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700;800&family=Unbounded:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
  }
]
```

Шрифты загружаются автоматически при запуске приложения.
