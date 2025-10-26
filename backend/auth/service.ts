import { api, APIError } from "encore.dev/api";
import { auth } from "../auth/auth";
import { prisma } from "../db";

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

/**
 * Регистрация нового пользователя
 */
export const register = api(
  { expose: true, method: "POST", path: "/auth/register" },
  async (req: RegisterRequest): Promise<RegisterResponse> => {
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

    // Регистрация через Better Auth
    try {
      const result = await auth.api.signUpEmail({
        body: {
          email: req.email,
          password: req.password,
          name: req.name || req.username,
        },
      });

      // Обновляем username (Better Auth не знает про него)
      const user = await prisma.user.update({
        where: { id: result.user.id },
        data: { username: req.username },
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
    } catch (error) {
      throw APIError.internal("Ошибка регистрации: " + error);
    }
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

    try {
      // Вход через Better Auth
      const result = await auth.api.signInEmail({
        body: {
          email: req.email,
          password: req.password,
        },
      });

      if (!result || !result.user) {
        throw APIError.unauthenticated("Неверный email или пароль");
      }

      // Получаем username
      const user = await prisma.user.findUnique({
        where: { id: result.user.id },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          avatar: true,
        },
      });

      return {
        success: true,
        message: "Вход выполнен успешно",
        token: result.token!,
        user: user!,
      };
    } catch (error) {
      throw APIError.unauthenticated("Неверный email или пароль");
    }
  }
);

/**
 * Выход пользователя
 */
export const logout = api(
  { expose: true, method: "POST", path: "/auth/logout" },
  async (req: LogoutRequest): Promise<LogoutResponse> => {
    if (!req.token) {
      throw APIError.invalidArgument("Token обязателен");
    }

    try {
      await auth.api.signOut({
        headers: {
          authorization: `Bearer ${req.token}`,
        },
      });

      return {
        success: true,
        message: "Выход выполнен успешно",
      };
    } catch (error) {
      throw APIError.internal("Ошибка при выходе");
    }
  }
);