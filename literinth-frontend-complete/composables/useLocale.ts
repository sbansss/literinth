export default function useLocale() {
  const locale = useState<"ru" | "en">("locale", () => {
    if (process.client) {
      const saved = localStorage.getItem("locale");
      if (saved === "ru" || saved === "en") {
        return saved;
      }
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("ru")) {
        return "ru";
      }
      return "en";
    }
    return "ru";
  });

  const setLocale = (newLocale: "ru" | "en") => {
    locale.value = newLocale;
    if (process.client) {
      localStorage.setItem("locale", newLocale);
    }
  };

  const t = computed(() => {
    return locale.value === "ru" ? translations.ru : translations.en;
  });

  return {
    locale: readonly(locale),
    setLocale,
    t,
  };
}

// Переводы интерфейса
const translations = {
  ru: {
    // Навигация
    home: "Главная",
    categories: "Категории",
    schematics: "Схематики",
    login: "Вход",
    register: "Регистрация",
    logout: "Выход",
    profile: "Профиль",
    mySchematics: "Мои схематики",
    favorites: "Избранное",
    admin: "Админ-панель",

    // Поиск и фильтры
    search: "Поиск...",
    searchPlaceholder: "Искать схематики...",
    sortBy: "Сортировка",
    sortPopular: "Популярные",
    sortNew: "Новые",
    sortDownloads: "По загрузкам",
    filterByCategory: "Фильтр по категориям",
    allCategories: "Все категории",

    // Схематики
    views: "просмотров",
    downloads: "загрузок",
    likes: "лайков",
    like: "Лайк",
    unlike: "Убрать лайк",
    download: "Скачать",
    author: "Автор",
    category: "Категория",
    tags: "Теги",
    createdAt: "Создано",
    updatedAt: "Обновлено",

    // Формы
    email: "Email",
    username: "Имя пользователя",
    password: "Пароль",
    name: "Имя",
    submit: "Отправить",
    cancel: "Отмена",
    save: "Сохранить",

    // Сообщения
    loading: "Загрузка...",
    noResults: "Ничего не найдено",
    error: "Ошибка",
    success: "Успешно",
    loginRequired: "Требуется авторизация",
    
    // Пагинация
    page: "Страница",
    of: "из",
    previous: "Назад",
    next: "Вперед",

    // Админ-панель
    adminPanel: "Панель администратора",
    statistics: "Статистика",
    contentManagement: "Управление контентом",
    visibility: "Видимость",
    visibleInRussian: "Видимо в русской версии",
    visibleInEnglish: "Видимо в английской версии",
    published: "Опубликовано",
    translations: "Переводы",
    russian: "Русский",
    english: "Английский",
    edit: "Редактировать",
    delete: "Удалить",
    totalUsers: "Всего пользователей",
    totalSchematics: "Всего схематиков",
    totalCategories: "Всего категорий",
  },

  en: {
    // Navigation
    home: "Home",
    categories: "Categories",
    schematics: "Schematics",
    login: "Login",
    register: "Register",
    logout: "Logout",
    profile: "Profile",
    mySchematics: "My Schematics",
    favorites: "Favorites",
    admin: "Admin Panel",

    // Search and filters
    search: "Search...",
    searchPlaceholder: "Search schematics...",
    sortBy: "Sort by",
    sortPopular: "Popular",
    sortNew: "New",
    sortDownloads: "Downloads",
    filterByCategory: "Filter by category",
    allCategories: "All categories",

    // Schematics
    views: "views",
    downloads: "downloads",
    likes: "likes",
    like: "Like",
    unlike: "Unlike",
    download: "Download",
    author: "Author",
    category: "Category",
    tags: "Tags",
    createdAt: "Created",
    updatedAt: "Updated",

    // Forms
    email: "Email",
    username: "Username",
    password: "Password",
    name: "Name",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",

    // Messages
    loading: "Loading...",
    noResults: "No results found",
    error: "Error",
    success: "Success",
    loginRequired: "Login required",
    
    // Pagination
    page: "Page",
    of: "of",
    previous: "Previous",
    next: "Next",

    // Admin panel
    adminPanel: "Admin Panel",
    statistics: "Statistics",
    contentManagement: "Content Management",
    visibility: "Visibility",
    visibleInRussian: "Visible in Russian version",
    visibleInEnglish: "Visible in English version",
    published: "Published",
    translations: "Translations",
    russian: "Russian",
    english: "English",
    edit: "Edit",
    delete: "Delete",
    totalUsers: "Total Users",
    totalSchematics: "Total Schematics",
    totalCategories: "Total Categories",
  },
};
