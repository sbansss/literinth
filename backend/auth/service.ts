import { api, APIError } from "encore.dev/api";
import { auth } from "../auth/auth";
import { prisma } from "../db";
import bcrypt from "bcrypt";

interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  name?: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    username: string;
    name: string | null;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    username: string;
    name: string | null;
    avatar: string | null;
  };
}

interface LogoutRequest {
  token: string;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

interface MeResponse {
  id: string;
  email: string;
  username: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: Date;
}

/**
 * Регистрация нового пользователя
 */
export const register = api(
  { expose: true, method: "POST", path: "/auth/register" },
  async (req: RegisterRequest): Promise<RegisterResponse> => {
    // Валидация
    if (!req.email || !req.username || !req.password) {
      throw APIError.invalidArgument("Email, username и password обязательны");
    }

    if (req.password.length < 6) {
      throw APIError.invalidArgument("Пароль должен быть минимум 6 символов");
    }

    // Проверка существования пользователя
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: req.email }, { username: req.username }],
      },
    });

    if (existingUser) {
      throw APIError.alreadyExists(
        "Пользователь с таким email или username уже существует"
      );
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(req.password, 10);

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        email: req.email,
        username: req.username,
        password: hashedPassword,
        name: req.name,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
      },
    });

    return {
      success: true,
      message: "Пользователь успешно зарегистрирован",
      user,
    };
  }
);

/**
 * Вход пользователя
 */
export const login = api(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req: LoginRequest): Promise<LoginResponse> => {
    if (!req.email || !req.password) {
      throw APIError.invalidArgument("Email и password обязательны");
    }

    // Поиск пользователя
    const user = await prisma.user.findUnique({
      where: { email: req.email },
    });

    if (!user) {
      throw APIError.unauthenticated("Неверный email или пароль");
    }

    // Проверка пароля
    const validPassword = await bcrypt.compare(req.password, user.password);

    if (!validPassword) {
      throw APIError.unauthenticated("Неверный email или пароль");
    }

    // Создание сессии через Better Auth
    const session = await auth.api.signInEmail({
      body: {
        email: req.email,
        password: req.password,
      },
    });

    if (!session) {
      throw APIError.internal("Ошибка создания сессии");
    }

    return {
      success: true,
      message: "Вход выполнен успешно",
      token: session.token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }
);

/**
 * Выход пользователя
 */
export const logout = api(
  { expose: true, method: "POST", path: "/auth/logout", auth: true },
  async (req: LogoutRequest): Promise<LogoutResponse> => {
    await auth.api.signOut({
      headers: {
        authorization: `Bearer ${req.token}`,
      },
    });

    return {
      success: true,
      message: "Выход выполнен успешно",
    };
  }
);

/**
 * Получение данных текущего пользователя
 */
export const me = api(
  { expose: true, method: "GET", path: "/auth/me", auth: true },
  async (): Promise<MeResponse> => {
    const session = await auth.api.getSession();

    if (!session) {
      throw APIError.unauthenticated("Не авторизован");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw APIError.notFound("Пользователь не найден");
    }

    return user;
  }
);
