import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Начинаем заполнение БД...");

  // Очистка существующих данных
  console.log("🗑️  Очистка существующих данных...");
  await prisma.schematicLike.deleteMany();
  await prisma.schematicTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.schematic.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Создание тестовых пользователей
  console.log("👤 Создание пользователей...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.create({
    data: {
      email: "alexey@literinth.com",
      username: "alexey_kuzmichev",
      password: hashedPassword,
      name: "Alexey Kuzmichev",
      bio: "Создатель крутых схематиков",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "ivan@literinth.com",
      username: "ivan_redstone",
      password: hashedPassword,
      name: "Ivan Petrov",
      bio: "Редстоун мастер",
    },
  });

  // Создание категорий
  console.log("📁 Создание категорий...");

  const hostileMobs = await prisma.category.create({
    data: {
      name: "Враждебные мобы",
      slug: "hostile-mobs",
      description: "Фермы враждебных мобов",
      order: 1,
      subcategories: {
        create: [
          { name: "Зомби", slug: "zombies", order: 1 },
          { name: "Скелеты", slug: "skeletons", order: 2 },
          { name: "Криперы", slug: "creepers", order: 3 },
        ],
      },
    },
  });

  const neutralMobs = await prisma.category.create({
    data: {
      name: "Нейтральные мобы",
      slug: "neutral-mobs",
      description: "Фермы нейтральных мобов",
      order: 2,
      subcategories: {
        create: [
          { name: "Железные големы", slug: "iron-golems", order: 1 },
          { name: "Пчелы", slug: "bees", order: 2 },
        ],
      },
    },
  });

  const passiveMobs = await prisma.category.create({
    data: {
      name: "Пассивные мобы",
      slug: "passive-mobs",
      description: "Фермы пассивных мобов",
      order: 3,
      subcategories: {
        create: [
          { name: "Коровы", slug: "cows", order: 1 },
          { name: "Курицы", slug: "chickens", order: 2 },
          { name: "Овцы", slug: "sheep", order: 3 },
        ],
      },
    },
  });

  const agriculture = await prisma.category.create({
    data: {
      name: "Агрокультуры",
      slug: "agriculture",
      description: "Фермы растений и грибов",
      order: 4,
      subcategories: {
        create: [
          { name: "Пшеница", slug: "wheat", order: 1 },
          { name: "Морковь", slug: "carrots", order: 2 },
          { name: "Картофель", slug: "potatoes", order: 3 },
          { name: "Тыквы", slug: "pumpkins", order: 4 },
          { name: "Арбузы", slug: "melons", order: 5 },
        ],
      },
    },
  });

  const blocksItems = await prisma.category.create({
    data: {
      name: "Блоки и предметы",
      slug: "blocks-items",
      description: "Фермы блоков и предметов",
      order: 5,
      subcategories: {
        create: [
          { name: "Булыжник", slug: "cobblestone", order: 1 },
          { name: "Обсидиан", slug: "obsidian", order: 2 },
          { name: "Базальт", slug: "basalt", order: 3 },
        ],
      },
    },
  });

  const itemProcessing = await prisma.category.create({
    data: {
      name: "Обработка предметов",
      slug: "item-processing",
      description: "Сортировки, хранилища, транспорт",
      order: 6,
      subcategories: {
        create: [
          { name: "Сортировки", slug: "sorters", order: 1 },
          { name: "Хранилища", slug: "storage", order: 2 },
          { name: "Транспорт", slug: "transport", order: 3 },
        ],
      },
    },
  });

  const infrastructure = await prisma.category.create({
    data: {
      name: "Инфраструктура",
      slug: "infrastructure",
      description: "Дороги, базы, города",
      order: 7,
      subcategories: {
        create: [
          { name: "Дороги", slug: "roads", order: 1 },
          { name: "Базы", slug: "bases", order: 2 },
          { name: "Города", slug: "cities", order: 3 },
        ],
      },
    },
  });

  const shitpost = await prisma.category.create({
    data: {
      name: "Щитпост",
      slug: "shitpost",
      description: "Мемные и экспериментальные схематики",
      order: 8,
      subcategories: {
        create: [
          { name: "Щитпост", slug: "shitpost-archive", order: 1 },
          { name: "Мусорка", slug: "trash", order: 2 },
        ],
      },
    },
  });

  // Получаем подкатегории
  const shitpostArchive = await prisma.subcategory.findFirst({
    where: { slug: "shitpost-archive" },
  });

  const sorters = await prisma.subcategory.findFirst({
    where: { slug: "sorters" },
  });

  // Создание тегов
  console.log("🏷️  Создание тегов...");
  const tagsPechki = await prisma.tag.create({
    data: { name: "Печки", slug: "pechki" },
  });
  const tagsRedstone = await prisma.tag.create({
    data: { name: "Редстоун", slug: "redstone" },
  });
  const tagsLitematica = await prisma.tag.create({
    data: { name: "Лайтматика", slug: "litematica" },
  });
  const tagsShitpost = await prisma.tag.create({
    data: { name: "Щитпост", slug: "shitpost" },
  });
  const tagsFarms = await prisma.tag.create({
    data: { name: "Фермы", slug: "farms" },
  });
  const tagsEfficient = await prisma.tag.create({
    data: { name: "Эффективные", slug: "efficient" },
  });

  // Создание схематиков
  console.log("📦 Создание схематиков...");

  const schematics = [];

  for (let i = 1; i <= 12; i++) {
    const schematic = await prisma.schematic.create({
      data: {
        title: `Furnace inferno ${10000 + i * 1000}`,
        slug: `furnace-inferno-${10000 + i * 1000}`,
        description: "Мега супер крутая печка с файлваем и автоматической загрузкой",
        content: `# Полное описание схематика
        
Это экспериментальный дизайн печки с невероятной производительностью!

## Особенности:
- Автоматическая загрузка топлива
- Сортировка готовой продукции
- Компактный дизайн
- Работает в любых условиях

## Требования:
- Редстоун
- Хопперы
- Печки
- Немного терпения`,
        authorId: i % 2 === 0 ? user1.id : user2.id,
        categoryId: shitpost.id,
        subcategoryId: shitpostArchive?.id,
        downloads: Math.floor(Math.random() * 1000000),
        views: Math.floor(Math.random() * 5000000),
        published: true,
        tags: {
          create: [
            { tag: { connect: { id: tagsPechki.id } } },
            { tag: { connect: { id: tagsRedstone.id } } },
            { tag: { connect: { id: tagsLitematica.id } } },
            { tag: { connect: { id: tagsShitpost.id } } },
          ],
        },
      },
    });
    schematics.push(schematic);
  }

  // Добавляем ещё немного разнообразных схематиков
  await prisma.schematic.create({
    data: {
      title: "Сортировка предметов 64x",
      slug: "item-sorter-64x",
      description: "Универсальная сортировка на 64 типа предметов",
      content: "Полная инструкция по постройке сортировки...",
      authorId: user2.id,
      categoryId: itemProcessing.id,
      subcategoryId: sorters?.id,
      downloads: 450000,
      views: 1200000,
      published: true,
      tags: {
        create: [
          { tag: { connect: { id: tagsRedstone.id } } },
          { tag: { connect: { id: tagsEfficient.id } } },
        ],
      },
    },
  });

  await prisma.schematic.create({
    data: {
      title: "Автоматическая ферма тыкв",
      slug: "auto-pumpkin-farm",
      description: "Полностью автоматическая ферма тыкв с обсервером",
      content: "Инструкция по постройке фермы...",
      authorId: user1.id,
      categoryId: agriculture.id,
      downloads: 780000,
      views: 2100000,
      published: true,
      tags: {
        create: [
          { tag: { connect: { id: tagsFarms.id } } },
          { tag: { connect: { id: tagsEfficient.id } } },
        ],
      },
    },
  });

  // Создание лайков
  console.log("❤️  Создание лайков...");
  for (const schematic of schematics.slice(0, 6)) {
    await prisma.schematicLike.create({
      data: {
        userId: user1.id,
        schematicId: schematic.id,
      },
    });
  }

  console.log("✅ База данных успешно заполнена!");
  console.log(`
📊 Статистика:
- Пользователей: 2
- Категорий: 8
- Подкатегорий: ${await prisma.subcategory.count()}
- Схематиков: ${await prisma.schematic.count()}
- Тегов: ${await prisma.tag.count()}
- Лайков: ${await prisma.schematicLike.count()}

🔐 Тестовые пользователи:
Email: alexey@literinth.com
Password: password123

Email: ivan@literinth.com
Password: password123
  `);
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при заполнении БД:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
