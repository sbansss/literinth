import { APIError, Gateway } from "encore.dev/api";
import { auth, type Session } from "../auth/auth";

interface AuthData {
  user: Session["user"];
  session: Session["session"];
}

/**
 * Middleware для проверки авторизации
 * Проверяет Bearer token из заголовка Authorization
 */
export async function requireAuth(req: Request): Promise<AuthData> {
  const authHeader = req.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw APIError.unauthenticated("Требуется авторизация");
  }

  const token = authHeader.substring(7);

  try {
    const session = await auth.api.getSession({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!session) {
      throw APIError.unauthenticated("Недействительная сессия");
    }

    return {
      user: session.user,
      session: session.session,
    };
  } catch (error) {
    throw APIError.unauthenticated("Ошибка авторизации");
  }
}

/**
 * Опциональная авторизация
 * Возвращает данные пользователя если авторизован, иначе null
 */
export async function optionalAuth(req: Request): Promise<AuthData | null> {
  try {
    return await requireAuth(req);
  } catch {
    return null;
  }
}
