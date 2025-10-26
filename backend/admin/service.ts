import { api, APIError } from "encore.dev/api";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";

// Проверка прав администратора
async function requireAdmin(req: RequestWithAuth) {
  const authData = await requireAuth(req as any);
  
  const user = await prisma.user.findUnique({
    where: { id: authData.user.id },
  });

  if (!user || user.role !== "ADMIN") {
    throw APIError.permissionDenied("Требуются права администратора");
  }

  return { user, authData };
}

// ===== ИНТЕРФЕЙСЫ =====

interface RequestWithAuth {
  headers?: Record<string, string>;
}

interface TranslationItem {
  id: string;
  name: string;
  description: string | null;
}

interface SubcategoryItem {
  id: string;
  slug: string;
  order: number;
  visibleRu: boolean;
  visibleEn: boolean;
  translations: {
    ru?: TranslationItem;
    en?: TranslationItem;
  };
}

interface CategoryItem {
  id: string;
  slug: string;
  icon: string | null;
  order: number;
  visibleRu: boolean;
  visibleEn: boolean;
  schematicsCount: number;
  translations: {
    ru?: TranslationItem;
    en?: TranslationItem;
  };
  subcategories: SubcategoryItem[];
}

interface AdminCategoriesResponse {
  categories: CategoryItem[];
}

interface UpdateVisibilityParams {
  id: string;
  visibleRu?: boolean;
  visibleEn?: boolean;
}

interface SuccessResponse {
  success: boolean;
}

interface TranslationInput {
  locale: "RU" | "EN";
  name: string;
  description?: string;
}

interface UpdateCategoryTranslationsParams {
  id: string;
  translations: TranslationInput[];
}

interface UpdateSubcategoryTranslationsParams {
  id: string;
  translations: TranslationInput[];
}

interface GetSchematicsParams {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
}

interface SchematicAuthor {
  id: string;
  username: string;
  name: string | null;
}

interface SchematicCategory {
  slug: string;
  name: string;
}

interface SchematicTranslations {
  ru?: unknown;
  en?: unknown;
}

interface SchematicItem {
  id: string;
  slug: string;
  imageUrl: string | null;
  downloads: number;
  views: number;
  likes: number;
  published: boolean;
  visibleRu: boolean;
  visibleEn: boolean;
  author: SchematicAuthor;
  category: SchematicCategory;
  translations: SchematicTranslations;
  createdAt: Date;
}

interface PaginationInfo {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

interface GetSchematicsResponse {
  data: SchematicItem[];
  pagination: PaginationInfo;
}

interface UpdateSchematicVisibilityParams {
  id: string;
  visibleRu?: boolean;
  visibleEn?: boolean;
  published?: boolean;
}

interface SchematicTranslationInput {
  locale: "RU" | "EN";
  title: string;
  description: string;
  content?: string;
}

interface UpdateSchematicTranslationsParams {
  id: string;
  translations: SchematicTranslationInput[];
}

interface SchematicsStats {
  total: number;
  published: number;
  visibleRu: number;
  visibleEn: number;
}

interface StatsResponse {
  users: number;
  schematics: SchematicsStats;
  categories: number;
}

// ===== КАТЕГОРИИ =====

export const adminGetCategories = api(
  { expose: true, method: "GET", path: "/api/admin/categories", auth: true },
  async (): Promise<AdminCategoriesResponse> => {
    // TODO: Получить request для auth
    // await requireAdmin(req);

    const categories = await prisma.category.findMany({
      include: {
        translations: true,
        subcategories: {
          include: {
            translations: true,
          },
        },
        _count: {
          select: { schematics: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return {
      categories: categories.map((cat) => ({
        id: cat.id,
        slug: cat.slug,
        icon: cat.icon,
        order: cat.order,
        visibleRu: cat.visibleRu,
        visibleEn: cat.visibleEn,
        schematicsCount: cat._count.schematics,
        translations: {
          ru: cat.translations.find((t) => t.locale === "RU"),
          en: cat.translations.find((t) => t.locale === "EN"),
        },
        subcategories: cat.subcategories.map((sub) => ({
          id: sub.id,
          slug: sub.slug,
          order: sub.order,
          visibleRu: sub.visibleRu,
          visibleEn: sub.visibleEn,
          translations: {
            ru: sub.translations.find((t) => t.locale === "RU"),
            en: sub.translations.find((t) => t.locale === "EN"),
          },
        })),
      })),
    };
  }
);

export const adminUpdateCategoryVisibility = api(
  { expose: true, method: "PATCH", path: "/api/admin/categories/:id/visibility", auth: true },
  async (params: UpdateVisibilityParams): Promise<SuccessResponse> => {
    // await requireAdmin(params as any);

    await prisma.category.update({
      where: { id: params.id },
      data: {
        visibleRu: params.visibleRu,
        visibleEn: params.visibleEn,
      },
    });

    return { success: true };
  }
);

export const adminUpdateCategoryTranslations = api(
  { expose: true, method: "PATCH", path: "/api/admin/categories/:id/translations", auth: true },
  async (params: UpdateCategoryTranslationsParams): Promise<SuccessResponse> => {
    // await requireAdmin(params as any);

    for (const trans of params.translations) {
      await prisma.categoryTranslation.upsert({
        where: {
          categoryId_locale: {
            categoryId: params.id,
            locale: trans.locale,
          },
        },
        create: {
          categoryId: params.id,
          locale: trans.locale,
          name: trans.name,
          description: trans.description,
        },
        update: {
          name: trans.name,
          description: trans.description,
        },
      });
    }

    return { success: true };
  }
);

// ===== ПОДКАТЕГОРИИ =====

export const adminUpdateSubcategoryVisibility = api(
  { expose: true, method: "PATCH", path: "/api/admin/subcategories/:id/visibility", auth: true },
  async (params: UpdateVisibilityParams): Promise<SuccessResponse> => {
    // await requireAdmin(params as any);

    await prisma.subcategory.update({
      where: { id: params.id },
      data: {
        visibleRu: params.visibleRu,
        visibleEn: params.visibleEn,
      },
    });

    return { success: true };
  }
);

export const adminUpdateSubcategoryTranslations = api(
  { expose: true, method: "PATCH", path: "/api/admin/subcategories/:id/translations", auth: true },
  async (params: UpdateSubcategoryTranslationsParams): Promise<SuccessResponse> => {
    // await requireAdmin(params as any);

    for (const trans of params.translations) {
      await prisma.subcategoryTranslation.upsert({
        where: {
          subcategoryId_locale: {
            subcategoryId: params.id,
            locale: trans.locale,
          },
        },
        create: {
          subcategoryId: params.id,
          locale: trans.locale,
          name: trans.name,
          description: trans.description,
        },
        update: {
          name: trans.name,
          description: trans.description,
        },
      });
    }

    return { success: true };
  }
);

// ===== СХЕМАТИКИ =====

export const adminGetSchematics = api(
  { expose: true, method: "GET", path: "/api/admin/schematics", auth: true },
  async (params: GetSchematicsParams): Promise<GetSchematicsResponse> => {
    // await requireAdmin(params as any);

    const page = params.page || 1;
    const perPage = params.perPage || 50;
    const skip = (page - 1) * perPage;

    const where: Record<string, unknown> = {};

    if (params.search) {
      where.OR = [
        { slug: { contains: params.search, mode: "insensitive" } },
        {
          translations: {
            some: {
              OR: [
                { title: { contains: params.search, mode: "insensitive" } },
                { description: { contains: params.search, mode: "insensitive" } },
              ],
            },
          },
        },
      ];
    }

    if (params.category) {
      where.category = { slug: params.category };
    }

    const [schematics, total] = await Promise.all([
      prisma.schematic.findMany({
        where,
        include: {
          translations: true,
          author: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
          category: {
            include: {
              translations: true,
            },
          },
          _count: {
            select: { likes: true },
          },
        },
        skip,
        take: perPage,
        orderBy: { createdAt: "desc" },
      }),
      prisma.schematic.count({ where }),
    ]);

    return {
      data: schematics.map((s) => ({
        id: s.id,
        slug: s.slug,
        imageUrl: s.imageUrl,
        downloads: s.downloads,
        views: s.views,
        likes: s._count.likes,
        published: s.published,
        visibleRu: s.visibleRu,
        visibleEn: s.visibleEn,
        author: s.author,
        category: {
          slug: s.category.slug,
          name: s.category.translations.find((t) => t.locale === "RU")?.name || s.category.slug,
        },
        translations: {
          ru: s.translations.find((t) => t.locale === "RU"),
          en: s.translations.find((t) => t.locale === "EN"),
        },
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

export const adminUpdateSchematicVisibility = api(
  { expose: true, method: "PATCH", path: "/api/admin/schematics/:id/visibility", auth: true },
  async (params: UpdateSchematicVisibilityParams): Promise<SuccessResponse> => {
    // await requireAdmin(params as any);

    await prisma.schematic.update({
      where: { id: params.id },
      data: {
        visibleRu: params.visibleRu,
        visibleEn: params.visibleEn,
        published: params.published,
      },
    });

    return { success: true };
  }
);

export const adminUpdateSchematicTranslations = api(
  { expose: true, method: "PATCH", path: "/api/admin/schematics/:id/translations", auth: true },
  async (params: UpdateSchematicTranslationsParams): Promise<SuccessResponse> => {
    // await requireAdmin(params as any);

    for (const trans of params.translations) {
      await prisma.schematicTranslation.upsert({
        where: {
          schematicId_locale: {
            schematicId: params.id,
            locale: trans.locale,
          },
        },
        create: {
          schematicId: params.id,
          locale: trans.locale,
          title: trans.title,
          description: trans.description,
          content: trans.content,
        },
        update: {
          title: trans.title,
          description: trans.description,
          content: trans.content,
        },
      });
    }

    return { success: true };
  }
);

// ===== СТАТИСТИКА =====

export const adminGetStats = api(
  { expose: true, method: "GET", path: "/api/admin/stats", auth: true },
  async (): Promise<StatsResponse> => {
    // await requireAdmin(req);

    const [
      totalUsers,
      totalSchematics,
      totalCategories,
      publishedSchematics,
      visibleRuSchematics,
      visibleEnSchematics,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.schematic.count(),
      prisma.category.count(),
      prisma.schematic.count({ where: { published: true } }),
      prisma.schematic.count({ where: { visibleRu: true } }),
      prisma.schematic.count({ where: { visibleEn: true } }),
    ]);

    return {
      users: totalUsers,
      schematics: {
        total: totalSchematics,
        published: publishedSchematics,
        visibleRu: visibleRuSchematics,
        visibleEn: visibleEnSchematics,
      },
      categories: totalCategories,
    };
  }
);