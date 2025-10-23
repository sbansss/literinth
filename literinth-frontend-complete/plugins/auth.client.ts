export default defineNuxtPlugin(async () => {
  const auth = useAuth()
  
  // Загружаем пользователя при запуске приложения
  if (process.client && localStorage.getItem('authToken')) {
    await auth.loadUser()
  }
})
