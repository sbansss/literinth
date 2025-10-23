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
      credentials: 'include', // Для работы с cookies
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка сервера' }))
      throw new Error(error.message || 'Ошибка API')
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

  const createSchematic = async (data: {
    title: string
    description: string
    categoryId: string
    subcategoryId?: string
    imageUrl?: string
    fileUrl?: string
    tags?: string[]
  }): Promise<{ success: boolean; schematic: Schematic }> => {
    return fetchAPI('/schematics', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  const downloadSchematic = async (id: string): Promise<{ success: boolean; fileUrl: string }> => {
    return fetchAPI(`/schematics/${id}/download`, { method: 'POST' })
  }

  const likeSchematic = async (id: string): Promise<{ success: boolean; liked: boolean; likes: number }> => {
    return fetchAPI(`/schematics/${id}/like`, { method: 'POST' })
  }

  // ============ КАТЕГОРИИ ============
  
  const getCategories = async (): Promise<{ categories: Category[] }> => {
    return fetchAPI('/categories')
  }

  const getCategory = async (slug: string): Promise<{ category: Category }> => {
    return fetchAPI(`/categories/${slug}`)
  }

  // ============ АВТОРИЗАЦИЯ ============
  
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
    
    if (result.user && process.client) {
      // Сохраняем токен если он есть
      if (result.token) {
        localStorage.setItem('authToken', result.token)
      }
    }
    
    return {
      success: true,
      data: result.user,
      message: 'Регистрация успешна'
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
    
    if (result.user && process.client) {
      // Сохраняем токен если он есть
      if (result.token) {
        localStorage.setItem('authToken', result.token)
      }
    }
    
    return {
      success: true,
      data: result.user,
      message: 'Вход выполнен успешно'
    }
  }

  const logout = async (): Promise<ApiResponse<null>> => {
    await fetchAPI('/auth/logout', { method: 'POST' })
    
    if (process.client) {
      localStorage.removeItem('authToken')
    }
    
    return {
      success: true,
      data: null,
      message: 'Выход выполнен'
    }
  }

  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const result = await fetchAPI<{ user: User }>('/auth/me')
      return result.user
    } catch (error) {
      if (process.client) {
        localStorage.removeItem('authToken')
      }
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
