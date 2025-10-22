import { api, APIError } from "encore.dev/api";
import { prisma } from "../db";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string;
}

interface GetCategoriesResponse {
  categories: Category[];
}

interface GetCategoryResponse {
  category: Category;
}

/**
 * Получить все категории со всеми подкатегориями
 */
export const getCategories = api(
  { expose: true, method: "GET", path: "/categories" },
  async (): Promise<GetCategoriesResponse> => {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        subcategories: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            categoryId: true,
          },
        },
      },
    });

    return { categories };
  }
);

/**
 * Получить одну категорию по slug
 */
export const getCategory = api(
  { expose: true, method: "GET", path: "/categories/:slug" },
  async ({ slug }: { slug: string }): Promise<GetCategoryResponse> => {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        subcategories: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            categoryId: true,
          },
        },
      },
    });

    if (!category) {
      throw APIError.notFound("Категория не найдена");
    }

    return { category };
  }
);
