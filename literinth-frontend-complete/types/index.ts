export interface User {
  id: string

  username: string
  name?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  subcategories?: Subcategory[]
  createdAt: string
  updatedAt: string
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  categoryId: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Schematic {
  id: string
  title: string
  description: string
  imageUrl?: string
  fileUrl?: string
  author?: User
  authorId: string
  category?: Category
  categoryId: string
  subcategory?: Subcategory
  subcategoryId?: string
  tags?: string[]
  views: number
  downloads: number
  likes: number
  isLiked?: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
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



export interface Category {
  id: string
  name: string
  icon?: string
  subcategories?: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  categoryId: string
}



export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
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

export type SortOption = 'popular' | 'recent' | 'downloads' | 'likes'
export type TabType = 'redstone' | 'builds' | 'worlds'
