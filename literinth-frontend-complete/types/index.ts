export interface User {
  id: string
  username: string
  name: string
  email: string
  image: string | null  // Было: string | null | undefined
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: string
  name: string
  slug: string
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
  imageUrl: string
  fileUrl: string
  author: User
  authorId: string
  category: Category
  categoryId: string
  subcategory?: Subcategory
  subcategoryId?: string
  tags: Tag[]
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

export type SortOption = 'popular' | 'recent' | 'downloads' | 'likes'
export type TabType = 'redstone' | 'builds' | 'worlds'