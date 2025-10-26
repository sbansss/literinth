import { Header } from "encore.dev/api";

export interface LocaleContext {
  locale: "ru" | "en";
}

// Автоматическое определение языка из заголовков
export function detectLocale(req: {
  headers?: Record<string, string | string[] | undefined>;
}): LocaleContext {
  const headers = req.headers || {};
  
  // 1. Проверяем заголовок X-Locale (приоритет)
  const xLocale = headers["x-locale"] as string;
  if (xLocale === "ru" || xLocale === "en") {
    return { locale: xLocale };
  }

  // 2. Проверяем Accept-Language
  const acceptLanguage = headers["accept-language"] as string;
  if (acceptLanguage) {
    const languages = acceptLanguage.split(",").map((lang) => {
      const parts = lang.trim().split(";");
      return parts[0].toLowerCase();
    });

    for (const lang of languages) {
      if (lang.startsWith("ru")) {
        return { locale: "ru" };
      }
      if (lang.startsWith("en")) {
        return { locale: "en" };
      }
    }
  }

  // 3. Дефолт - русский
  return { locale: "ru" };
}

// Helper для получения локали из параметров или автоопределения
export function getLocale(params: { locale?: string }, req?: any): "ru" | "en" {
  // Если локаль явно указана в параметрах
  if (params.locale === "ru" || params.locale === "en") {
    return params.locale;
  }

  // Если есть request - автоопределение
  if (req) {
    return detectLocale(req).locale;
  }

  // Дефолт
  return "ru";
}
