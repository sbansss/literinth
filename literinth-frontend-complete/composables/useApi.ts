import type { Schematic, PaginatedResponse, Category, User, ApiResponse } from '~/types'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://localhost:4000'

  // Функция для выполнения запросов
  const fetchAPI = async <T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> => {
    const token = process.client ? localStorage.getItem('authToken') : null
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    }

    const response = await fetch(`${baseURL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка сервера' }))
      throw new Error(error.message || `HTTP error ${response.status}`)
    }

    return response.json()
  }

  // ============ СХЕМАТИКИ ============
  
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

const createSchematic = async (data: FormData): Promise<{ schematic: Schematic }> => {
  return fetchAPI('/schematics', {
    method: 'POST',
    body: data,
  })
}


  const downloadSchematic = async (id: string): Promise<{ success: boolean; fileUrl: string }> => {
    return fetchAPI(`/schematics/${id}/download`, { 
      method: 'POST' 
    })
  }

  const likeSchematic = async (id: string): Promise<{ success: boolean; liked: boolean; likes: number }> => {
    return fetchAPI(`/schematics/${id}/like`, { 
      method: 'POST' 
    })
  }

  // ============ КАТЕГОРИИ ============
  
  const getCategories = async (): Promise<{ categories: Category[] }> => {
    return fetchAPI('/categories')
  }

  const getCategory = async (slug: string): Promise<{ category: Category }> => {
    return fetchAPI(`/categories/${slug}`)
  }

  // ============ АВТОРИЗАЦИЯ ============
  // ИСПРАВЛЕНО: правильная обработка ответов API
  
  const register = async (data: {
    email: string
    username: string
    password: string
    name?: string
  }): Promise<ApiResponse<User>> => {
    const result = await fetchAPI<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    // Преобразуем ответ backend в User
    const user: User = {
      id: result.user.id,
      username: result.user.username,
      name: result.user.name || result.user.username,
      email: result.user.email,
      image: result.user.avatar || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    return {
      success: true,
      data: user,
      message: result.message || 'Регистрация успешна'
    }
  }

  const login = async (data: {
    email: string
    password: string
  }): Promise<ApiResponse<User>> => {
    const result = await fetchAPI<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    // Сохраняем токен
    if (result.token && process.client) {
      localStorage.setItem('authToken', result.token)
    }
    
    // Преобразуем ответ backend в User
    const user: User = {
      id: result.user.id,
      username: result.user.username,
      name: result.user.name || result.user.username,
      email: result.user.email,
      image: result.user.avatar || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    return {
      success: true,
      data: user,
      message: result.message || 'Вход выполнен успешно'
    }
  }

  const logout = async (): Promise<ApiResponse<null>> => {
    const token = process.client ? localStorage.getItem('authToken') : null
    
    if (token) {
      try {
        await fetchAPI('/auth/logout', { 
          method: 'POST',
          body: JSON.stringify({ token }),
        })
      } catch (error) {
        // Игнорируем ошибки при выходе
        console.error('Ошибка при выходе:', error)
      }
    }
    
    if (process.client) {
      localStorage.removeItem('authToken')
    }
    
    return {
      success: true,
      data: null,
      message: 'Выход выполнен'
    }
  }

  // ИСПРАВЛЕНО: getCurrentUser теперь правильно получает данные пользователя
  const getCurrentUser = async (): Promise<User | null> => {
    try {
      // Проверяем наличие токена
      const token = process.client ? localStorage.getItem('authToken') : null
      
      if (!token) {
        return null
      }

      // Делаем запрос с токеном в заголовке
      const response = await fetchAPI<MeResponse>('/auth/me')
      
      // Преобразуем MeResponse в User (avatar -> image, добавляем updatedAt)
      return {
        id: response.id,
        username: response.username,
        name: response.name || response.username,
        email: response.email,
        image: response.avatar, // avatar из backend -> image для frontend
        createdAt: response.createdAt,
        updatedAt: response.createdAt, // Используем createdAt как updatedAt
      }
    } catch (error) {
      // Если токен невалиден, удаляем его
      if (process.client) {
        localStorage.removeItem('authToken')
      }
      console.error('Ошибка получения пользователя:', error)
      return null
    }
  }

  return {
    // Схематики
    getSchematics,
    getSchematic,
    createSchematic,
    downloadSchematic,
    likeSchematic,
    
    // Категории
    getCategories,
    getCategory,
    
    // Авторизация
    register,
    login,
    logout,
    getCurrentUser,
  }
}

// Тип для ответа /auth/me
interface MeResponse {
  id: string
  email: string
  username: string
  name: string | null
  avatar: string | null
  bio: string | null
  createdAt: string
}