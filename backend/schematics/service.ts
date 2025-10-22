import { api, APIError } from "encore.dev/api";
import { prisma } from "../db";
import { requireAuth, optionalAuth } from "../middleware/auth";

interface Schematic {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  fileUrl: string | null;
  author: {
    id: string;
    username: string;
    name: string | null;
    avatar: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: { id: string; name: string; slug: string }[];
  downloads: number;
  views: number;
  likes: number;
  isLiked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface GetSchematicsRequest {
  page?: number;
  perPage?: number;
  category?: string;
  subcategory?: string;
  search?: string;
  sort?: "popular" | "recent" | "downloads" | "likes";
  authorId?: string;
}

interface GetSchematicsResponse {
  data: Schematic[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

interface GetSchematicResponse {
  schematic: Schematic;
}

interface CreateSchematicRequest {
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  fileUrl?: string;
  categoryId: string;
  subcategoryId?: string;
  tags?: string[];
}

interface UpdateSchematicRequest {
  id: string;
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  fileUrl?: string;
  categoryId?: string;
  subcategoryId?: string;
  tags?: string[];
  published?: boolean;
}

interface DeleteSchematicRequest {
  id: string;
}

interface LikeSchematicRequest {
  id: string;
}

interface LikeSchematicResponse {
  success: boolean;
  liked: boolean;
  likes: number;
}

/**
 * Получить список схематиков с фильтрацией и пагинацией
 */
export const getSchematics = api(
  { expose: true, method: "GET", path: "/schematics" },
  async (req: GetSchematicsRequest): Promise<GetSchematicsResponse> => {
    const page = req.page || 1;
    const perPage = Math.min(req.perPage || 20, 100);
    const skip = (page - 1) * perPage;

    // Построение WHERE условий
    const where: any = {
      published: true,
    };

    if (req.category) {
      where.category = { slug: req.category };
    }

    if (req.subcategory) {
      where.subcategory = { slug: req.subcategory };
    }

    if (req.search) {
      where.OR = [
        { title: { contains: req.search, mode: "insensitive" } },
        { description: { contains: req.search, mode: "insensitive" } },
      ];
    }

    if (req.authorId) {
      where.authorId = req.authorId;
    }

    // Сортировка
    let orderBy: any = { createdAt: "desc" };

    switch (req.sort) {
      case "popular":
        orderBy = { views: "desc" };
        break;
      case "downloads":
        orderBy = { downloads: "desc" };
        break;
      case "likes":
        orderBy = { likes: { _count: "desc" } };
        break;
      case "recent":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Получение схематиков
    const [schematics, total] = await Promise.all([
      prisma.schematic.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          subcategory: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
      }),
      prisma.schematic.count({ where }),
    ]);

    // Форматирование данных
    const data = schematics.map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      description: s.description,
      imageUrl: s.imageUrl,
      fileUrl: s.fileUrl,
      author: s.author,
      category: s.category,
      subcategory: s.subcategory,
      tags: s.tags.map((t) => t.tag),
      downloads: s.downloads,
      views: s.views,
      likes: s._count.likes,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    return {
      data,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }
);

/**
 * Получить один схематик по ID или slug
 */
export const getSchematic = api(
  { expose: true, method: "GET", path: "/schematics/:id" },
  async ({ id }: { id: string }): Promise<GetSchematicResponse> => {
    const schematic = await prisma.schematic.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!schematic) {
      throw APIError.notFound("Схематик не найден");
    }

    // Увеличиваем счетчик просмотров
    await prisma.schematic.update({
      where: { id: schematic.id },
      data: { views: { increment: 1 } },
    });

    return {
      schematic: {
        id: schematic.id,
        title: schematic.title,
        slug: schematic.slug,
        description: schematic.description,
        imageUrl: schematic.imageUrl,
        fileUrl: schematic.fileUrl,
        author: schematic.author,
        category: schematic.category,
        subcategory: schematic.subcategory,
        tags: schematic.tags.map((t) => t.tag),
        downloads: schematic.downloads,
        views: schematic.views + 1,
        likes: schematic._count.likes,
        createdAt: schematic.createdAt,
        updatedAt: schematic.updatedAt,
      },
    };
  }
);

/**
 * Создать новый схематик (требуется авторизация)
 */
export const createSchematic = api(
  { expose: true, method: "POST", path: "/schematics", auth: true },
  async (req: CreateSchematicRequest): Promise<GetSchematicResponse> => {
    // Получаем текущего пользователя
    const authData = await requireAuth(req as any);

    // Генерация slug из title
    const slug = req.title
      .toLowerCase()
      .replace(/[^a-zа-я0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Создание схематика
    const schematic = await prisma.schematic.create({
      data: {
        title: req.title,
        slug,
        description: req.description,
        content: req.content,
        imageUrl: req.imageUrl,
        fileUrl: req.fileUrl,
        authorId: authData.user.id,
        categoryId: req.categoryId,
        subcategoryId: req.subcategoryId,
        tags: req.tags
          ? {
              create: req.tags.map((tagName) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName },
                    create: {
                      name: tagName,
                      slug: tagName.toLowerCase().replace(/\s+/g, "-"),
                    },
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return {
      schematic: {
        id: schematic.id,
        title: schematic.title,
        slug: schematic.slug,
        description: schematic.description,
        imageUrl: schematic.imageUrl,
        fileUrl: schematic.fileUrl,
        author: schematic.author,
        category: schematic.category,
        subcategory: schematic.subcategory,
        tags: schematic.tags.map((t) => t.tag),
        downloads: schematic.downloads,
        views: schematic.views,
        likes: schematic._count.likes,
        createdAt: schematic.createdAt,
        updatedAt: schematic.updatedAt,
      },
    };
  }
);

/**
 * Лайкнуть/убрать лайк со схематика (требуется авторизация)
 */
export const likeSchematic = api(
  { expose: true, method: "POST", path: "/schematics/:id/like", auth: true },
  async (req: LikeSchematicRequest): Promise<LikeSchematicResponse> => {
    const authData = await requireAuth(req as any);

    // Проверяем существование схематика
    const schematic = await prisma.schematic.findUnique({
      where: { id: req.id },
    });

    if (!schematic) {
      throw APIError.notFound("Схематик не найден");
    }

    // Проверяем существующий лайк
    const existingLike = await prisma.schematicLike.findUnique({
      where: {
        userId_schematicId: {
          userId: authData.user.id,
          schematicId: req.id,
        },
      },
    });

    let liked: boolean;

    if (existingLike) {
      // Убираем лайк
      await prisma.schematicLike.delete({
        where: { id: existingLike.id },
      });
      liked = false;
    } else {
      // Добавляем лайк
      await prisma.schematicLike.create({
        data: {
          userId: authData.user.id,
          schematicId: req.id,
        },
      });
      liked = true;
    }

    // Получаем обновленное количество лайков
    const likesCount = await prisma.schematicLike.count({
      where: { schematicId: req.id },
    });

    return {
      success: true,
      liked,
      likes: likesCount,
    };
  }
);

/**
 * Скачать схематик (инкрементирует счетчик загрузок)
 */
export const downloadSchematic = api(
  { expose: true, method: "POST", path: "/schematics/:id/download" },
  async ({ id }: { id: string }): Promise<{ success: boolean; fileUrl: string }> => {
    const schematic = await prisma.schematic.findUnique({
      where: { id },
      select: { id: true, fileUrl: true },
    });

    if (!schematic || !schematic.fileUrl) {
      throw APIError.notFound("Файл схематика не найден");
    }

    // Увеличиваем счетчик загрузок
    await prisma.schematic.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });

    return {
      success: true,
      fileUrl: schematic.fileUrl,
    };
  }
);
