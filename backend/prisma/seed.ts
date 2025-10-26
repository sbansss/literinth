import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Начинаем заполнение БД с i18n...");

  // Очистка существующих данных
  console.log("🗑️  Очистка существующих данных...");
  await prisma.schematicLike.deleteMany();
  await prisma.schematicTag.deleteMany();
  await prisma.tagTranslation.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.schematicTranslation.deleteMany();
  await prisma.schematic.deleteMany();
  await prisma.subcategoryTranslation.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.categoryTranslation.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Создание тестовых пользователей напрямую через Prisma
  console.log("👤 Создание пользователей...");

  // Админ
  const admin = await prisma.user.create({
    data: {
      email: "admin@literinth.com",
      password: hashSync("password123", 10),
      name: "Admin User",
      username: "admin",
      bio: "Администратор платформы",
      role: "ADMIN",
    },
  });

  // Юзер 1
  const user1 = await prisma.user.create({
    data: {
      email: "alexey@literinth.com",
      password: hashSync("password123", 10),
      name: "Alexey Kuzmichev",
      username: "alexey_kuzmichev",
      bio: "Создатель крутых схематиков",
      role: "USER",
    },
  });

  // Юзер 2
  const user2 = await prisma.user.create({
    data: {
      email: "ivan@literinth.com",
      password: hashSync("password123", 10),
      name: "Ivan Petrov",
      username: "ivan_redstone",
      bio: "Редстоун мастер",
      role: "USER",

    },
  });

  // Создание категорий с переводами
  console.log("📁 Создание категорий с переводами...");

  // 1. Враждебные мобы
  const hostileMobs = await prisma.category.create({
    data: {
      slug: "hostile-mobs",
      order: 1,
      visibleRu: true,
      visibleEn: true,
      translations: {
        create: [
          {
            locale: "RU",
            name: "Враждебные мобы",
            description: "Фермы враждебных мобов",
          },
          {
            locale: "EN",
            name: "Hostile Mobs",
            description: "Hostile mob farms",
          },
        ],
      },
      subcategories: {
        create: [
          {
            slug: "zombies",
            order: 1,
            visibleRu: true,
            visibleEn: true,
            translations: {
              create: [
                { locale: "RU", name: "Зомби" },
                { locale: "EN", name: "Zombies" },
              ],
            },
          },
          {
            slug: "skeletons",
            order: 2,
            visibleRu: true,
            visibleEn: true,
            translations: {
              create: [
                { locale: "RU", name: "Скелеты" },
                { locale: "EN", name: "Skeletons" },
              ],
            },
          },
          {
            slug: "creepers",
            order: 3,
            visibleRu: true,
            visibleEn: true,
            translations: {
              create: [
                { locale: "RU", name: "Криперы" },
                { locale: "EN", name: "Creepers" },
              ],
            },
          },
        ],
      },
    },
  });

  // 2. Нейтральные мобы
  const neutralMobs = await prisma.category.create({
    data: {
      slug: "neutral-mobs",
      order: 2,
      visibleRu: true,
      visibleEn: true,
      translations: {
        create: [
          {
            locale: "RU",
            name: "Нейтральные мобы",
            description: "Фермы нейтральных мобов",
          },
          {
            locale: "EN",
            name: "Neutral Mobs",
            description: "Neutral mob farms",
          },
        ],
      },
      subcategories: {
        create: [
          {
            slug: "iron-golems",
            order: 1,
            visibleRu: true,
            visibleEn: true,
            translations: {
              create: [
                { locale: "RU", name: "Железные големы" },
                { locale: "EN", name: "Iron Golems" },
              ],
            },
          },
          {
            slug: "bees",
            order: 2,
            visibleRu: true,
            visibleEn: true,
            translations: {
              create: [
                { locale: "RU", name: "Пчелы" },
                { locale: "EN", name: "Bees" },
              ],
            },
          },
        ],
      },
    },
  });

  // 3. Пассивные мобы
  const passiveMobs = await prisma.category.create({
    data: {
      slug: "passive-mobs",
      order: 3,
      visibleRu: true,
      visibleEn: true,
      translations: {
        create: [
          {
            locale: "RU",
            name: "Пассивные мобы",
            description: "Фермы пассивных мобов",
          },
          {
            locale: "EN",
            name: "Passive Mobs",
            description: "Passive mob farms",
          },
        ],
      },
      subcategories: {
        create: [
          {
            slug: "cows",
            order: 1,
            visibleRu: true,
            visibleEn: true,
            translations: {
              create: [
                { locale: "RU", name: "Коровы" },
                { locale: "EN", name: "Cows" },
              ],
            },
          },
          {
            slug: "chickens",
            order: 2,
            visibleRu: true,
            visibleEn: true,
            translations: {
              create: [
                { locale: "RU", name: "Курицы" },
                { locale: "EN", name: "Chickens" },
              ],
            },
          },
          {
            slug: "sheep",
            order: 3,
            visibleRu: true,
            visibleEn: true,
            translations: {
              create: [
                { locale: "RU", name: "Овцы" },
                { locale: "EN", name: "Sheep" },
              ],
            },
          },
        ],
      },
    },
  });

  // 4. Агрокультуры
  const agriculture = await prisma.category.create({
    data: {
      slug: "agriculture",
      order: 4,
      visibleRu: true,
      visibleEn: true,
      translations: {
        create: [
          {
            locale: "RU",
            name: "Агрокультуры",
            description: "Фермы растений и грибов",
          },
          {
            locale: "EN",
            name: "Agriculture",
            description: "Plant and mushroom farms",
          },
        ],
      },
      subcategories: {
        create: [
          {
            slug: "wheat",
            order: 1,
            visibleRu: true,
            visibleEn: true,
            translations: {
              create: [
                { locale: "RU", name: "Пшеница" },
                { locale: "EN", name: "Wheat" },
              ],
            },
          },
          {
            slug: "carrots",
            order: 2,
            visibleRu: true,
            visibleEn: true,
            translations: {
              create: [
                { locale: "RU", name: "Морковь" },
                { locale: "EN", name: "Carrots" },
              ],
            },
          },
          {
            slug: "pumpkins",
            order: 3,
            visibleRu: true,
            visibleEn: true,
            translations: {
              create: [
                { locale: "RU", name: "Тыквы" },
                { locale: "EN", name: "Pumpkins" },
              ],
            },
          },
        ],
      },
    },
  });

  // 5. Обработка предметов
  const itemProcessing = await prisma.category.create({
    data: {
      slug: "item-processing",
      order: 5,
      visibleRu: true,
      visibleEn: true,
      translations: {
        create: [
          {
            locale: "RU",
            name: "Обработка предметов",
            description: "Сортировщики и хранилища",
          },
          {
            locale: "EN",
            name: "Item Processing",
            description: "Sorters and storage",
          },
        ],
      },
      subcategories: {
        create: [
          {
            slug: "sorters",
            order: 1,
            visibleRu: true,
            visibleEn: true,
            translations: {
              create: [
                { locale: "RU", name: "Сортировщики" },
                { locale: "EN", name: "Sorters" },
              ],
            },
          },
        ],
      },
    },
  });

  // 6. Щитпост
  const shitpost = await prisma.category.create({
    data: {
      slug: "shitpost",
      order: 6,
      visibleRu: true,
      visibleEn: true,
      translations: {
        create: [
          {
            locale: "RU",
            name: "Щитпост",
            description: "Мемные и экспериментальные схематики",
          },
          {
            locale: "EN",
            name: "Shitpost",
            description: "Meme and experimental schematics",
          },
        ],
      },
      subcategories: {
        create: [
          {
            slug: "shitpost-archive",
            order: 1,
            visibleRu: true,
            visibleEn: true,
            translations: {
              create: [
                { locale: "RU", name: "Щитпост" },
                { locale: "EN", name: "Shitpost Archive" },
              ],
            },
          },
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

  const pumpkins = await prisma.subcategory.findFirst({
    where: { slug: "pumpkins" },
  });

  // Создание тегов с переводами
  console.log("🏷️  Создание тегов с переводами...");
  const tagPechki = await prisma.tag.create({
    data: {
      slug: "pechki",
      translations: {
        create: [
          { locale: "RU", name: "Печки" },
          { locale: "EN", name: "Furnaces" },
        ],
      },
    },
  });

  const tagRedstone = await prisma.tag.create({
    data: {
      slug: "redstone",
      translations: {
        create: [
          { locale: "RU", name: "Редстоун" },
          { locale: "EN", name: "Redstone" },
        ],
      },
    },
  });

  const tagLitematica = await prisma.tag.create({
    data: {
      slug: "litematica",
      translations: {
        create: [
          { locale: "RU", name: "Лайтматика" },
          { locale: "EN", name: "Litematica" },
        ],
      },
    },
  });

  const tagShitpost = await prisma.tag.create({
    data: {
      slug: "shitpost",
      translations: {
        create: [
          { locale: "RU", name: "Щитпост" },
          { locale: "EN", name: "Shitpost" },
        ],
      },
    },
  });

  const tagFarms = await prisma.tag.create({
    data: {
      slug: "farms",
      translations: {
        create: [
          { locale: "RU", name: "Фермы" },
          { locale: "EN", name: "Farms" },
        ],
      },
    },
  });

  const tagEfficient = await prisma.tag.create({
    data: {
      slug: "efficient",
      translations: {
        create: [
          { locale: "RU", name: "Эффективные" },
          { locale: "EN", name: "Efficient" },
        ],
      },
    },
  });

  // Создание схематиков с переводами
  console.log("📦 Создание схематиков с переводами...");

  const schematics = [];

  for (let i = 1; i <= 12; i++) {
    const schematic = await prisma.schematic.create({
      data: {
        slug: `furnace-inferno-${10000 + i * 1000}`,
        authorId: i % 2 === 0 ? user1.id : user2.id,
        categoryId: shitpost.id,
        subcategoryId: shitpostArchive?.id,
        downloads: Math.floor(Math.random() * 1000000),
        views: Math.floor(Math.random() * 5000000),
        published: true,
        visibleRu: true,
        visibleEn: true,
        translations: {
          create: [
            {
              locale: "RU",
              title: `Furnace inferno ${10000 + i * 1000}`,
              description:
                "Мега супер крутая печка с файлваем и автоматической загрузкой",
              content: `# Полное описание схематика
        
Это экспериментальный дизайн печки с невероятной производительностью!

## Особенности:
- Автоматическая загрузка топлива
- Сортировка готовой продукции
- Компактный дизайн
- Работает в любых условиях`,
            },
            {
              locale: "EN",
              title: `Furnace Inferno ${10000 + i * 1000}`,
              description:
                "Mega super cool furnace with flywheels and automatic loading",
              content: `# Full schematic description
        
This is an experimental furnace design with incredible performance!

## Features:
- Automatic fuel loading
- Finished product sorting
- Compact design
- Works in any conditions`,
            },
          ],
        },
        tags: {
          create: [
            { tag: { connect: { id: tagPechki.id } } },
            { tag: { connect: { id: tagRedstone.id } } },
            { tag: { connect: { id: tagLitematica.id } } },
            { tag: { connect: { id: tagShitpost.id } } },
          ],
        },
      },
    });
    schematics.push(schematic);
  }

  // Добавляем ещё разнообразные схематики
  await prisma.schematic.create({
    data: {
      slug: "item-sorter-64x",
      authorId: user2.id,
      categoryId: itemProcessing.id,
      subcategoryId: sorters?.id,
      downloads: 450000,
      views: 1200000,
      published: true,
      visibleRu: true,
      visibleEn: true,
      translations: {
        create: [
          {
            locale: "RU",
            title: "Сортировка предметов 64x",
            description: "Универсальная сортировка на 64 типа предметов",
            content: "Полная инструкция по постройке сортировки...",
          },
          {
            locale: "EN",
            title: "Item Sorter 64x",
            description: "Universal sorter for 64 item types",
            content: "Full building instructions...",
          },
        ],
      },
      tags: {
        create: [
          { tag: { connect: { id: tagRedstone.id } } },
          { tag: { connect: { id: tagEfficient.id } } },
        ],
      },
    },
  });

  await prisma.schematic.create({
    data: {
      slug: "auto-pumpkin-farm",
      authorId: user1.id,
      categoryId: agriculture.id,
      subcategoryId: pumpkins?.id,
      downloads: 780000,
      views: 2100000,
      published: true,
      visibleRu: true,
      visibleEn: true,
      translations: {
        create: [
          {
            locale: "RU",
            title: "Автоматическая ферма тыкв",
            description: "Полностью автоматическая ферма тыкв с обсервером",
            content: "Инструкция по постройке фермы...",
          },
          {
            locale: "EN",
            title: "Automatic Pumpkin Farm",
            description: "Fully automatic pumpkin farm with observer",
            content: "Farm building instructions...",
          },
        ],
      },
      tags: {
        create: [
          { tag: { connect: { id: tagFarms.id } } },
          { tag: { connect: { id: tagEfficient.id } } },
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
- Пользователей: 3 (1 админ + 2 юзера)
- Категорий: 6
- Подкатегорий: ${await prisma.subcategory.count()}
- Схематиков: ${await prisma.schematic.count()}
- Тегов: ${await prisma.tag.count()}
- Лайков: ${await prisma.schematicLike.count()}

🔐 Тестовые пользователи:

АДМИН:
Email: admin@literinth.com
Password: password123

ЮЗЕРЫ:
Email: alexey@literinth.com
Password: password123

Email: ivan@literinth.com
Password: password123

🌍 Все данные созданы с переводами RU/EN
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