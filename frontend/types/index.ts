export interface Schematic {
  id: string
  title: string
  description: string
  author: string
  downloads: number
  likes: number
  category: string
  subcategory: string
  tags: string[]
  imageUrl?: string
  updatedAt: string
  createdAt: string
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

export interface User {
  id: string
  username: string
  avatar?: string
  email?: string
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
