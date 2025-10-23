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
          <h1 class="text-3xl font-bold font-display text-white mb-2">Вход</h1>
          <p class="text-gray-400">Войдите в свой аккаунт LiteRinth</p>
        </div>

        <!-- Форма -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
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
              class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <!-- Ошибка -->
          <div v-if="error" class="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p class="text-red-400 text-sm">{{ error }}</p>
          </div>

          <!-- Кнопка входа -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Войти</span>
            <span v-else class="flex items-center justify-center space-x-2">
              <Icon name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
              <span>Вход...</span>
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

        <!-- Регистрация -->
        <div class="text-center">
          <p class="text-gray-400">
            Нет аккаунта?
            <NuxtLink to="/register" class="text-primary hover:text-primary-dark font-medium transition-colors">
              Зарегистрироваться
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
  email: '',
  password: '',
})

const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    await auth.loginUser(form.email, form.password)
    router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Ошибка входа. Проверьте email и пароль.'
  } finally {
    loading.value = false
  }
}
</script>
