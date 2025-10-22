# 🏗️ Архитектура LiteRinth Backend

## Высокоуровневая архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                     NUXT 3 FRONTEND                         │
│  (Vue.js, Tailwind CSS, TypeScript)                         │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST API
                     │ Authorization: Bearer <token>
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    ENCORE.TS BACKEND                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API ENDPOINTS (Services)                │  │
│  │                                                      │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │  │
│  │  │   Auth     │  │ Categories │  │  Schematics  │  │  │
│  │  │  Service   │  │  Service   │  │   Service    │  │  │
│  │  └────────────┘  └────────────┘  └──────────────┘  │  │
│  │       │                │                  │         │  │
│  └───────┼────────────────┼──────────────────┼─────────┘  │
│          │                │                  │             │
│  ┌───────┴────────────────┴──────────────────┴─────────┐  │
│  │              MIDDLEWARE LAYER                       │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  requireAuth() / optionalAuth()              │  │  │
│  │  │  (Bearer Token validation)                   │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └─────────────────────┬────────────────────────────────┘  │
│                        │                                    │
│  ┌─────────────────────┴────────────────────────────────┐  │
│  │              BETTER AUTH                             │  │
│  │  - Email/Password authentication                     │  │
│  │  - Session management                                │  │
│  │  - JWT tokens                                        │  │
│  │  - Password hashing (bcrypt)                         │  │
│  └─────────────────────┬────────────────────────────────┘  │
│                        │                                    │
│  ┌─────────────────────┴────────────────────────────────┐  │
│  │              PRISMA ORM                              │  │
│  │  - Type-safe queries                                 │  │
│  │  - Migrations                                        │  │
│  │  - Connection pooling                                │  │
│  └─────────────────────┬────────────────────────────────┘  │
└────────────────────────┼────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                      │
│                                                             │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐  │
│  │  users  │  │categories│  │ schematics │  │   tags   │  │
│  └─────────┘  └──────────┘  └────────────┘  └──────────┘  │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐  │
│  │sessions │  │subcateg. │  │schematic_  │  │schematic_│  │
│  │         │  │          │  │   tags     │  │  likes   │  │
│  └─────────┘  └──────────┘  └────────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Потоки данных

### 1. Авторизация
```
User Registration Flow:
┌──────┐    POST /auth/register    ┌──────────┐
│Client├───────────────────────────►│  Auth    │
└──────┘                            │ Service  │
                                    └────┬─────┘
                                         │ bcrypt.hash(password)
                                         ▼
                                    ┌─────────┐
                                    │ Prisma  │
                                    └────┬────┘
                                         │ INSERT INTO users
                                         ▼
                                    ┌──────────┐
                                    │PostgreSQL│
                                    └──────────┘

Login Flow:
┌──────┐    POST /auth/login       ┌──────────┐
│Client├───────────────────────────►│  Auth    │
└──────┘                            │ Service  │
                                    └────┬─────┘
                                         │ 1. Find user
                                         │ 2. bcrypt.compare()
                                         │ 3. Better Auth session
                                         ▼
                                    ┌──────────┐
                    token ◄─────────│PostgreSQL│
                                    └──────────┘
```

### 2. Получение схематиков
```
┌──────┐   GET /schematics?category=...   ┌───────────┐
│Client├────────────────────────────────►│Schematics │
└──────┘                                  │ Service   │
                                          └─────┬─────┘
                                                │
                                          ┌─────▼─────┐
                                          │  Prisma   │
                                          │ - WHERE   │
                                          │ - ORDER   │
                                          │ - SKIP    │
                                          │ - TAKE    │
                                          └─────┬─────┘
                                                │
                                          ┌─────▼─────┐
                                          │PostgreSQL │
                                          └─────┬─────┘
                                                │
    ┌───────────────────────────────────────────┘
    │
    ▼
┌──────┐
│Client│ ◄── { data: [...], pagination: {...} }
└──────┘
```

### 3. Создание схематика (с авторизацией)
```
┌──────┐  POST /schematics + Bearer Token  ┌───────────┐
│Client├────────────────────────────────────►│Schematics │
└──────┘                                     │ Service   │
                                             └─────┬─────┘
                                                   │
                                             ┌─────▼─────┐
                                             │requireAuth│
                                             │middleware │
                                             └─────┬─────┘
                                                   │ Validate token
                                                   ▼
                                             ┌───────────┐
                                             │Better Auth│
                                             └─────┬─────┘
                                                   │ Get user
                                                   ▼
                                             ┌───────────┐
                                             │  Prisma   │
                                             │  CREATE   │
                                             └─────┬─────┘
                                                   │
                                             ┌─────▼─────┐
                                             │PostgreSQL │
                                             └───────────┘
```

## Модель данных

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │◄────────┐
│ email       │         │
│ username    │         │
│ password    │         │
│ name        │         │
│ avatar      │         │
└─────────────┘         │
                        │
                        │ authorId
                        │
┌─────────────┐         │        ┌─────────────┐
│  Category   │         │        │ Subcategory │
├─────────────┤         │        ├─────────────┤
│ id          │◄────┐   │    ┌──►│ id          │
│ name        │     │   │    │   │ categoryId  │
│ slug        │     │   │    │   │ name        │
└─────────────┘     │   │    │   │ slug        │
                    │   │    │   └─────────────┘
         categoryId │   │    │ subcategoryId
                    │   │    │
               ┌────┴───┴────┴────┐
               │    Schematic     │
               ├──────────────────┤
               │ id               │
               │ title            │
               │ slug             │
               │ description      │
               │ imageUrl         │
               │ fileUrl          │
               │ downloads        │
               │ views            │
               │ published        │
               └────┬─────────┬───┘
                    │         │
       ┌────────────┘         └────────────┐
       │                                   │
       │ schematicId                       │ schematicId
       │                                   │
┌──────┴──────┐                   ┌────────┴────────┐
│SchematicTag │                   │ SchematicLike   │
├─────────────┤                   ├─────────────────┤
│ schematicId │                   │ userId          │
│ tagId       │                   │ schematicId     │
└──────┬──────┘                   └─────────────────┘
       │
       │ tagId
       │
┌──────┴──────┐
│     Tag     │
├─────────────┤
│ id          │
│ name        │
│ slug        │
└─────────────┘
```

## Безопасность

```
Request Flow с авторизацией:

1. Client sends request
   └─► Authorization: Bearer <token>

2. Encore.ts receives request
   └─► Routing to service

3. Middleware checks auth
   └─► requireAuth() / optionalAuth()
       └─► Extract token from header
           └─► Validate with Better Auth
               ├─► Valid: Continue to service
               └─► Invalid: Return 401 Unauthorized

4. Service processes request
   └─► Access to user data via authData.user

5. Prisma executes queries
   └─► Type-safe operations
       └─► SQL injection protection

6. Response sent to client
```

## Масштабирование

```
Future Architecture (для больших нагрузок):

┌──────────┐
│  Nuxt 3  │
│ Frontend │
└────┬─────┘
     │
     ▼
┌────────────────┐
│  Load Balancer │
└────┬───────────┘
     │
     ├──────────┬──────────┬──────────┐
     ▼          ▼          ▼          ▼
┌─────────┐┌─────────┐┌─────────┐┌─────────┐
│Encore.ts││Encore.ts││Encore.ts││Encore.ts│
│Instance1││Instance2││Instance3││Instance4│
└────┬────┘└────┬────┘└────┬────┘└────┬────┘
     │          │          │          │
     └──────────┴──────────┴──────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
   ┌─────────┐      ┌────────┐
   │  Redis  │      │Postgres│
   │ (Cache) │      │ Primary│
   └─────────┘      └───┬────┘
                        │
                   ┌────┴────┐
                   │         │
                   ▼         ▼
              ┌────────┐┌────────┐
              │Postgres││Postgres│
              │Replica1││Replica2│
              └────────┘└────────┘
```

## Структура сервисов

```
auth/
├── auth.ts          ─── Better Auth config
└── service.ts       ─── API endpoints
    ├── register()
    ├── login()
    ├── logout()
    └── me()

categories/
└── service.ts       ─── API endpoints
    ├── getCategories()
    └── getCategory()

schematics/
└── service.ts       ─── API endpoints
    ├── getSchematics()
    ├── getSchematic()
    ├── createSchematic()
    ├── likeSchematic()
    └── downloadSchematic()

middleware/
└── auth.ts          ─── Auth middleware
    ├── requireAuth()
    └── optionalAuth()
```

## Технологические слои

```
┌────────────────────────────────────┐
│      Presentation Layer            │
│  (API Endpoints / REST)            │
│  - JSON responses                  │
│  - HTTP status codes               │
│  - Error handling                  │
└──────────────┬─────────────────────┘
               │
┌──────────────▼─────────────────────┐
│      Business Logic Layer          │
│  (Services)                        │
│  - Data validation                 │
│  - Business rules                  │
│  - Authorization checks            │
└──────────────┬─────────────────────┘
               │
┌──────────────▼─────────────────────┐
│      Data Access Layer             │
│  (Prisma ORM)                      │
│  - Type-safe queries               │
│  - Relations handling              │
│  - Transaction support             │
└──────────────┬─────────────────────┘
               │
┌──────────────▼─────────────────────┐
│      Database Layer                │
│  (PostgreSQL)                      │
│  - Data persistence                │
│  - ACID transactions               │
│  - Indexing                        │
└────────────────────────────────────┘
```

---

Эта архитектура обеспечивает:
- ✅ Масштабируемость
- ✅ Безопасность
- ✅ Производительность
- ✅ Maintainability
- ✅ Type Safety
