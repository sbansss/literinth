# 🔌 Подключение фронтенда к бэкенду

## Для фронтенда на Nuxt 3

### 1. Обновите `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  // ... остальная конфигурация
  
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:4000'
    }
  }
})
```

### 2. Создайте `.env` в фронтенде

```env
NUXT_PUBLIC_API_BASE=http://localhost:4000
```

### 3. Обновите `composables/useApi.ts`

Замените моковые функции на реальные запросы:

```typescript
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  // Функция для выполнения запросов
  const fetchAPI = async <T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> => {
    const token = localStorage.getItem('authToken')
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    }

    const response = await fetch(`${baseURL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Ошибка API')
    }

    return response.json()
  }

  // Схематики
  const getSchematics = async (params?: {
    page?: number
    perPage?: number
    category?: string
    subcategory?: string
    search?: string
    sort?: string
  }): Promise<PaginatedResponse<Schematic>> => {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.perPage) queryParams.append('perPage', params.perPage.toString())
    if (params?.category) queryParams.append('category', params.category)
    if (params?.subcategory) queryParams.append('subcategory', params.subcategory)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sort) queryParams.append('sort', params.sort)
    
    const query = queryParams.toString()
    return fetchAPI(`/schematics${query ? '?' + query : ''}`)
  }

  const getSchematic = async (id: string): Promise<{ schematic: Schematic }> => {
    return fetchAPI(`/schematics/${id}`)
  }

  const downloadSchematic = async (id: string): Promise<{ success: boolean; fileUrl: string }> => {
    return fetchAPI(`/schematics/${id}/download`, { method: 'POST' })
  }

  const likeSchematic = async (id: string): Promise<{ success: boolean; liked: boolean; likes: number }> => {
    return fetchAPI(`/schematics/${id}/like`, { method: 'POST' })
  }

  // Категории
  const getCategories = async (): Promise<{ categories: Category[] }> => {
    return fetchAPI('/categories')
  }

  const getCategory = async (slug: string): Promise<{ category: Category }> => {
    return fetchAPI(`/categories/${slug}`)
  }

  // Авторизация
  const register = async (data: {
    email: string
    username: string
    password: string
    name?: string
  }): Promise<{ success: boolean; message: string; user?: any }> => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  const login = async (data: {
    email: string
    password: string
  }): Promise<{ success: boolean; message: string; token?: string; user?: any }> => {
    const result = await fetchAPI<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    if (result.token) {
      localStorage.setItem('authToken', result.token)
    }
    
    return result
  }

  const logout = async (): Promise<{ success: boolean; message: string }> => {
    const token = localStorage.getItem('authToken')
    const result = await fetchAPI<any>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
    
    localStorage.removeItem('authToken')
    return result
  }

  const getCurrentUser = async (): Promise<User | null> => {
    try {
      return await fetchAPI('/auth/me')
    } catch {
      return null
    }
  }

  return {
    getSchematics,
    getSchematic,
    downloadSchematic,
    likeSchematic,
    getCategories,
    getCategory,
    register,
    login,
    logout,
    getCurrentUser,
  }
}
```

### 4. Обновите типы в `types/index.ts`

Добавьте недостающие типы если нужно:

```typescript
export interface User {
  id: string
  email: string
  username: string
  name: string | null
  avatar: string | null
  bio: string | null
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  description: string | null
  categoryId: string
}

export interface Schematic {
  id: string
  title: string
  slug: string
  description: string
  imageUrl: string | null
  fileUrl: string | null
  author: {
    id: string
    username: string
    name: string | null
    avatar: string | null
  }
  category: {
    id: string
    name: string
    slug: string
  }
  subcategory: {
    id: string
    name: string
    slug: string
  } | null
  tags: Array<{ id: string; name: string; slug: string }>
  downloads: number
  views: number
  likes: number
  isLiked?: boolean
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}
```

## Примеры использования в компонентах

### Получение схематиков с параметрами

```vue
<script setup lang="ts">
const api = useApi()
const schematics = ref<Schematic[]>([])
const loading = ref(false)

const loadSchematics = async () => {
  loading.value = true
  try {
    const response = await api.getSchematics({
      page: 1,
      perPage: 20,
      category: 'shitpost',
      sort: 'popular'
    })
    schematics.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSchematics()
})
</script>
```

### Авторизация

```vue
<script setup lang="ts">
const api = useApi()
const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    const result = await api.login({
      email: email.value,
      password: password.value
    })
    
    if (result.success) {
      // Успешный вход
      console.log('Вход выполнен!', result.user)
      // Перенаправление или обновление UI
    }
  } catch (err: any) {
    error.value = err.message
  }
}
</script>
```

### Лайк схематика

```vue
<script setup lang="ts">
const api = useApi()

const handleLike = async (schematicId: string) => {
  try {
    const result = await api.likeSchematic(schematicId)
    console.log(`Лайк: ${result.liked}, Всего лайков: ${result.likes}`)
  } catch (err: any) {
    console.error('Ошибка:', err.message)
  }
}
</script>
```

### Скачивание схематика

```vue
<script setup lang="ts">
const api = useApi()

const handleDownload = async (schematicId: string) => {
  try {
    const result = await api.downloadSchematic(schematicId)
    // Открываем файл для скачивания
    window.open(result.fileUrl, '_blank')
  } catch (err: any) {
    console.error('Ошибка:', err.message)
  }
}
</script>
```

## Обработка ошибок

Создайте глобальный обработчик ошибок:

```typescript
// plugins/error-handler.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vue:error', (error) => {
    console.error('Глобальная ошибка:', error)
    
    // Показать уведомление пользователю
    // Например, через toast или notification
  })
})
```

## CORS (если нужно)

Если фронтенд и бэкенд на разных доменах, убедитесь что в бэкенде настроен CORS.
Encore.ts обычно настраивает CORS автоматически для development режима.

Для production добавьте в Encore конфигурацию (если потребуется).

## Проверка работы

1. Запустите бэкенд: `npm run dev` (в директории backend)
2. Запустите фронтенд: `npm run dev` (в директории frontend)
3. Откройте http://localhost:3000
4. Проверьте что данные загружаются с бэкенда

## Тестирование

```bash
# В консоли браузера проверьте:
console.log('API Base:', useRuntimeConfig().public.apiBase)

# Проверьте что запросы идут на правильный URL в Network tab
```

---

✅ **Готово!** Теперь ваш фронтенд подключен к бэкенду!
