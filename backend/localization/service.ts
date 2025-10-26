import { api } from "encore.dev/api";
import { prisma } from "../db";

interface LocaleParams {
  locale?: "ru" | "en";
}

interface Translation {
  id: string;
  name: string;
  description: string | null;
}

interface Subcategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}

interface Category {
  id: string;
  slug: string;
  icon: string | null;
  name: string;
  description: string | null;
  subcategories: Subcategory[];
}

interface CategoriesResponse {
  categories: Category[];
}

interface Author {
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
  bio?: string | null;
}

interface CategoryInfo {
  slug: string;
  name: string;
}

interface Tag {
  slug: string;
  name: string;
}

interface SchematicItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string | null;
  imageUrl: string | null;
  fileUrl: string | null;
  downloads: number;
  views: number;
  likes: number;
  author: Author;
  category: CategoryInfo;
  tags: Tag[];
  createdAt: Date;
}

interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

interface SchematicsResponse {
  data: SchematicItem[];
  pagination: Pagination;
}

interface GetSchematicsParams {
  locale?: "ru" | "en";
  page?: number;
  perPage?: number;
  category?: string;
  subcategory?: string;
  search?: string;
  sort?: string;
}

interface SchematicDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string | null;
  imageUrl: string | null;
  fileUrl: string | null;
  downloads: number;
  views: number;
  likes: number;
  published: boolean;
  author: Author;
  category: CategoryInfo;
  subcategory: CategoryInfo | null;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}

interface SchematicResponse {
  schematic: SchematicDetail;
}

interface GetSchematicParams {
  id: string;
  locale?: "ru" | "en";
}

// Получить все категории с переводами
export const getCategories = api(
  { expose: true, method: "GET", path: "/api/categories" },
  async (params: LocaleParams): Promise<CategoriesResponse> => {
    const locale = params.locale || "ru";

    const categories = await prisma.category.findMany({
      where: {
        [locale === "ru" ? "visibleRu" : "visibleEn"]: true,
      },
      include: {
        translations: {
          where: { locale: locale.toUpperCase() as "RU" | "EN" },
        },
        subcategories: {
          where: {
            [locale === "ru" ? "visibleRu" : "visibleEn"]: true,
          },
          include: {
            translations: {
              where: { locale: locale.toUpperCase() as "RU" | "EN" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return {
      categories: categories.map((cat) => ({
        id: cat.id,
        slug: cat.slug,
        icon: cat.icon,
        name: cat.translations[0]?.name || cat.slug,
        description: cat.translations[0]?.description || null,
        subcategories: cat.subcategories.map((sub) => ({
          id: sub.id,
          slug: sub.slug,
          name: sub.translations[0]?.name || sub.slug,
          description: sub.translations[0]?.description || null,
        })),
      })),
    };
  }
);

// Получить схематики с переводами
export const getSchematics = api(
  { expose: true, method: "GET", path: "/api/schematics" },
  async (params: GetSchematicsParams): Promise<SchematicsResponse> => {
    const locale = params.locale || "ru";
    const page = params.page || 1;
    const perPage = params.perPage || 20;
    const skip = (page - 1) * perPage;

    const where: Record<string, unknown> = {
      published: true,
      [locale === "ru" ? "visibleRu" : "visibleEn"]: true,
    };

    if (params.category) {
      where.category = { slug: params.category };
    }

    if (params.subcategory) {
      where.subcategory = { slug: params.subcategory };
    }

    if (params.search) {
      where.translations = {
        some: {
          locale: locale.toUpperCase() as "RU" | "EN",
          OR: [
            { title: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
          ],
        },
      };
    }

    let orderBy: Record<string, unknown> = { createdAt: "desc" };
    if (params.sort === "popular") {
      orderBy = { likes: { _count: "desc" } };
    } else if (params.sort === "downloads") {
      orderBy = { downloads: "desc" };
    }

    const [schematics, total] = await Promise.all([
      prisma.schematic.findMany({
        where,
        include: {
          translations: {
            where: { locale: locale.toUpperCase() as "RU" | "EN" },
          },
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true,
            },
          },
          category: {
            include: {
              translations: {
                where: { locale: locale.toUpperCase() as "RU" | "EN" },
              },
            },
          },
          tags: {
            include: {
              tag: {
                include: {
                  translations: {
                    where: { locale: locale.toUpperCase() as "RU" | "EN" },
                  },
                },
              },
            },
          },
          _count: {
            select: { likes: true },
          },
        },
        skip,
        take: perPage,
        orderBy,
      }),
      prisma.schematic.count({ where }),
    ]);

    return {
      data: schematics.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.translations[0]?.title || s.slug,
        description: s.translations[0]?.description || "",
        content: s.translations[0]?.content || null,
        imageUrl: s.imageUrl,
        fileUrl: s.fileUrl,
        downloads: s.downloads,
        views: s.views,
        likes: s._count.likes,
        author: s.author,
        category: {
          slug: s.category.slug,
          name: s.category.translations[0]?.name || s.category.slug,
        },
        tags: s.tags.map((t) => ({
          slug: t.tag.slug,
          name: t.tag.translations[0]?.name || t.tag.slug,
        })),
        createdAt: s.createdAt,
      })),
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }
);

// Получить один схематик с переводами
export const getSchematic = api(
  { expose: true, method: "GET", path: "/api/schematics/:id" },
  async (params: GetSchematicParams): Promise<SchematicResponse> => {
    const locale = params.locale || "ru";

    const schematic = await prisma.schematic.findUnique({
      where: { id: params.id },
      include: {
        translations: {
          where: { locale: locale.toUpperCase() as "RU" | "EN" },
        },
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            bio: true,
          },
        },
        category: {
          include: {
            translations: {
              where: { locale: locale.toUpperCase() as "RU" | "EN" },
            },
          },
        },
        subcategory: {
          include: {
            translations: {
              where: { locale: locale.toUpperCase() as "RU" | "EN" },
            },
          },
        },
        tags: {
          include: {
            tag: {
              include: {
                translations: {
                  where: { locale: locale.toUpperCase() as "RU" | "EN" },
                },
              },
            },
          },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!schematic) {
      throw new Error("Schematic not found");
    }

    await prisma.schematic.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return {
      schematic: {
        id: schematic.id,
        slug: schematic.slug,
        title: schematic.translations[0]?.title || schematic.slug,
        description: schematic.translations[0]?.description || "",
        content: schematic.translations[0]?.content || null,
        imageUrl: schematic.imageUrl,
        fileUrl: schematic.fileUrl,
        downloads: schematic.downloads,
        views: schematic.views + 1,
        likes: schematic._count.likes,
        published: schematic.published,
        author: schematic.author,
        category: {
          slug: schematic.category.slug,
          name: schematic.category.translations[0]?.name || schematic.category.slug,
        },
        subcategory: schematic.subcategory
          ? {
              slug: schematic.subcategory.slug,
              name: schematic.subcategory.translations[0]?.name || schematic.subcategory.slug,
            }
          : null,
        tags: schematic.tags.map((t) => ({
          slug: t.tag.slug,
          name: t.tag.translations[0]?.name || t.tag.slug,
        })),
        createdAt: schematic.createdAt,
        updatedAt: schematic.updatedAt,
      },
    };
  }
);