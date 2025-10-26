// Типы для всего приложения

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string | null;
  image?: string | null; // Алиас для avatar
  bio?: string | null;
  role?: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  order: number;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export interface Schematic {
  id: string;
  slug: string;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  fileUrl?: string;
  downloads: number;
  views: number;
  likes: number;
  published: boolean;
  author: User;
  category: Category;
  subcategory?: Subcategory;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export type SortOption = "popular" | "new" | "downloads" | "views" | "recent" | "likes";

export type TabType = "all" | "category" | "subcategory" | string;