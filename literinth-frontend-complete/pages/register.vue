<template>
  <div class="min-h-screen bg-dark-bg flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Карточка -->
      <div class="bg-dark-card border border-dark-border rounded-2xl p-8">
        <!-- Заголовок -->
        <div class="text-center mb-8">
          <NuxtLink to="/" class="inline-flex items-center space-x-2 mb-4">
            <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="heroicons:cube" class="w-7 h-7 text-white" />
            </div>
          </NuxtLink>
          <h1 class="text-3xl font-bold font-display text-white mb-2">Регистрация</h1>
          <p class="text-gray-400">Создайте аккаунт LiteRinth</p>
        </div>

        <!-- Форма -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Имя -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
              Имя (необязательно)
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Ваше имя"
            />
          </div>

          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-300 mb-2">
              Имя пользователя
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              minlength="3"
              maxlength="30"
              pattern="[a-zA-Z0-9_]+"
              class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="username"
            />
            <p class="mt-1 text-xs text-gray-500">Только буквы, цифры и подчеркивание</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="your@email.com"
            />
          </div>

          <!-- Пароль -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Пароль
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="••••••••"
            />
            <p class="mt-1 text-xs text-gray-500">Минимум 8 символов</p>
          </div>

          <!-- Подтверждение пароля -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
              Подтвердите пароль
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <!-- Ошибка -->
          <div v-if="error" class="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p class="text-red-400 text-sm">{{ error }}</p>
          </div>

          <!-- Кнопка регистрации -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Зарегистрироваться</span>
            <span v-else class="flex items-center justify-center space-x-2">
              <Icon name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
              <span>Регистрация...</span>
            </span>
          </button>
        </form>

        <!-- Разделитель -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-dark-border"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-dark-card text-gray-400">или</span>
          </div>
        </div>

        <!-- Вход -->
        <div class="text-center">
          <p class="text-gray-400">
            Уже есть аккаунт?
            <NuxtLink to="/login" class="text-primary hover:text-primary-dark font-medium transition-colors">
              Войти
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Назад -->
      <div class="text-center mt-6">
        <NuxtLink to="/" class="text-gray-400 hover:text-white transition-colors inline-flex items-center space-x-1">
          <Icon name="heroicons:arrow-left" class="w-4 h-4" />
          <span>Вернуться на главную</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const auth = useAuth()
const router = useRouter()

const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  error.value = ''

  // Валидация
  if (form.password !== form.confirmPassword) {
    error.value = 'Пароли не совпадают'
    return
  }

  if (form.password.length < 8) {
    error.value = 'Пароль должен содержать минимум 8 символов'
    return
  }

  if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    error.value = 'Имя пользователя может содержать только буквы, цифры и подчеркивание'
    return
  }

  loading.value = true

  try {
    await auth.registerUser({
      email: form.email,
      username: form.username,
      password: form.password,
      name: form.name || undefined,
    })
    router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Ошибка регистрации. Попробуйте другой email или username.'
  } finally {
    loading.value = false
  }
}
</script>
