import type { Schematic, PaginatedResponse, Category, User, ApiResponse } from '~/types'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || '/api'

  // Схематики
  const getSchematics = async (params?: {
    page?: number
    perPage?: number
    category?: string
    subcategory?: string
    search?: string
    sort?: string
  }): Promise<PaginatedResponse<Schematic>> => {
    // TODO: Заменить на реальный API запрос
    return {
      data: getMockSchematics(),
      pagination: {
        page: params?.page || 1,
        perPage: params?.perPage || 20,
        total: 100,
        totalPages: 5
      }
    }
  }

  const getSchematic = async (id: string): Promise<Schematic | null> => {
    // TODO: Заменить на реальный API запрос
    const schematics = getMockSchematics()
    return schematics.find(s => s.id === id) || null
  }

  // Категории
  const getCategories = async (): Promise<Category[]> => {
    // TODO: Заменить на реальный API запрос
    return getMockCategories()
  }

  // Пользователь
  const getCurrentUser = async (): Promise<User | null> => {
    // TODO: Заменить на реальный API запрос
    return null
  }

  const login = async (username: string, password: string): Promise<ApiResponse<User>> => {
    // TODO: Заменить на реальный API запрос
    return {
      success: false,
      message: 'API не подключен',
      data: {} as User
    }
  }

  return {
    getSchematics,
    getSchematic,
    getCategories,
    getCurrentUser,
    login
  }
}

// Моковые данные для разработки
function getMockSchematics(): Schematic[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: `schematic-${i + 1}`,
    title: 'Furnace inferno 10000',
    description: 'Мега супер крутая печка 10000 с файлваем',
    author: 'Alexey Kuzmichev',
    downloads: 999000,
    likes: 999000,
    category: 'shitpost',
    subcategory: 'shitpost-archive',
    tags: ['Печки', 'Редстоун', 'Лайтматика', 'Щитпост'],
    updatedAt: '4 года назад',
    createdAt: '2021-01-01'
  }))
}

function getMockCategories(): Category[] {
  return [
    {
      id: 'hostile-mobs',
      name: 'Враждебные мобы',
      subcategories: []
    },
    {
      id: 'neutral-mobs',
      name: 'Нейтральные мобы',
      subcategories: []
    },
    {
      id: 'passive-mobs',
      name: 'Пассивные мобы',
      subcategories: []
    },
    {
      id: 'agriculture',
      name: 'Агрокультуры',
      subcategories: []
    },
    {
      id: 'blocks-items',
      name: 'Блоки и предметы',
      subcategories: []
    },
    {
      id: 'item-processing',
      name: 'Обработка предметов',
      subcategories: []
    },
    {
      id: 'infrastructure',
      name: 'Инфраструктура',
      subcategories: []
    },
    {
      id: 'shitpost',
      name: 'Щитпост',
      subcategories: [
        { id: 'shitpost-archive', name: 'Щитпост', categoryId: 'shitpost' },
        { id: 'trash', name: 'Мусорка', categoryId: 'shitpost' }
      ]
    }
  ]
}
