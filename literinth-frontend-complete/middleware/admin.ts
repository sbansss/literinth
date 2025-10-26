export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth();

  // Проверяем авторизацию
  if (!auth.isAuthenticated.value) {
    return navigateTo("/login");
  }

  // Проверяем роль администратора
  if (auth.user.value?.role !== "ADMIN") {
    return navigateTo("/");
  }
});
