export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase as string;
  const { locale } = useLocale();

  const fetchAPI = async <T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> => {
    const token = process.client ? localStorage.getItem("authToken") : null;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Locale": locale.value, // Передаем текущую локаль
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    };

    const response = await fetch(`${baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "API Error");
    }

    return response.json();
  };

  // Схематики с учетом локали
  const getSchematics = async (params?: {
    page?: number;
    perPage?: number;
    category?: string;
    subcategory?: string;
    search?: string;
    sort?: string;
  }) => {
    const queryParams = new URLSearchParams();

    queryParams.append("locale", locale.value);

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.perPage)
      queryParams.append("perPage", params.perPage.toString());
    if (params?.category) queryParams.append("category", params.category);
    if (params?.subcategory)
      queryParams.append("subcategory", params.subcategory);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sort) queryParams.append("sort", params.sort);

    const query = queryParams.toString();
    return fetchAPI<any>(`/api/schematics${query ? "?" + query : ""}`);
  };

  const getSchematic = async (id: string) => {
    return fetchAPI<any>(`/api/schematics/${id}?locale=${locale.value}`);
  };

  const getCategories = async () => {
    return fetchAPI<any>(`/api/categories?locale=${locale.value}`);
  };

  const getCategory = async (slug: string) => {
    return fetchAPI<any>(`/api/categories/${slug}?locale=${locale.value}`);
  };

  const downloadSchematic = async (id: string) => {
    return fetchAPI<any>(`/api/schematics/${id}/download`, {
      method: "POST",
    });
  };

  const likeSchematic = async (id: string) => {
    return fetchAPI<any>(`/api/schematics/${id}/like`, { method: "POST" });
  };

  // Авторизация
  const register = async (data: {
    email: string;
    username: string;
    password: string;
    name?: string;
  }) => {
    return fetchAPI<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  const login = async (data: { email: string; password: string }) => {
    return fetchAPI<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  const logout = async () => {
    return fetchAPI<any>("/auth/logout", { method: "POST" });
  };

  const me = async () => {
    return fetchAPI<any>("/auth/me");
  };

  const getCurrentUser = async () => {
    const response = await fetchAPI<any>("/auth/me");
    return response.user;
  };

  const createSchematic = async (data: FormData | any) => {
    return fetchAPI<any>("/schematics", {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
      headers: data instanceof FormData ? {} : { "Content-Type": "application/json" },
    });
  };

  // === АДМИН API ===

  const adminGetStats = async () => {
    return fetchAPI<any>("/api/admin/stats");
  };

  const adminGetCategories = async () => {
    return fetchAPI<any>("/api/admin/categories");
  };

  const adminUpdateCategoryVisibility = async (
    id: string,
    data: { visibleRu?: boolean; visibleEn?: boolean }
  ) => {
    return fetchAPI<any>(`/api/admin/categories/${id}/visibility`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  };

  const adminUpdateCategoryTranslations = async (
    id: string,
    translations: { locale: "RU" | "EN"; name: string; description?: string }[]
  ) => {
    return fetchAPI<any>(`/api/admin/categories/${id}/translations`, {
      method: "PATCH",
      body: JSON.stringify({ translations }),
    });
  };

  const adminUpdateSubcategoryVisibility = async (
    id: string,
    data: { visibleRu?: boolean; visibleEn?: boolean }
  ) => {
    return fetchAPI<any>(`/api/admin/subcategories/${id}/visibility`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  };

  const adminUpdateSubcategoryTranslations = async (
    id: string,
    translations: { locale: "RU" | "EN"; name: string; description?: string }[]
  ) => {
    return fetchAPI<any>(`/api/admin/subcategories/${id}/translations`, {
      method: "PATCH",
      body: JSON.stringify({ translations }),
    });
  };

  const adminGetSchematics = async (params?: {
    page?: number;
    perPage?: number;
    search?: string;
    category?: string;
  }) => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.perPage)
      queryParams.append("perPage", params.perPage.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.category) queryParams.append("category", params.category);

    const query = queryParams.toString();
    return fetchAPI<any>(`/api/admin/schematics${query ? "?" + query : ""}`);
  };

  const adminUpdateSchematicVisibility = async (
    id: string,
    data: { visibleRu?: boolean; visibleEn?: boolean; published?: boolean }
  ) => {
    return fetchAPI<any>(`/api/admin/schematics/${id}/visibility`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  };

  const adminUpdateSchematicTranslations = async (
    id: string,
    translations: {
      locale: "RU" | "EN";
      title: string;
      description: string;
      content?: string;
    }[]
  ) => {
    return fetchAPI<any>(`/api/admin/schematics/${id}/translations`, {
      method: "PATCH",
      body: JSON.stringify({ translations }),
    });
  };

  return {
    getSchematics,
    getSchematic,
    getCategories,
    getCategory,
    downloadSchematic,
    likeSchematic,
    register,
    login,
    logout,
    me,
    getCurrentUser,
    createSchematic,
    // Admin
    adminGetStats,
    adminGetCategories,
    adminUpdateCategoryVisibility,
    adminUpdateCategoryTranslations,
    adminUpdateSubcategoryVisibility,
    adminUpdateSubcategoryTranslations,
    adminGetSchematics,
    adminUpdateSchematicVisibility,
    adminUpdateSchematicTranslations,
  };
};
