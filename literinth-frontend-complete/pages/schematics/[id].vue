<template>
  <div class="min-h-screen bg-dark-bg">
    <Header />
    
    <div v-if="loading" class="max-w-7xl mx-auto px-4 py-20 text-center">
      <Icon name="heroicons:arrow-path" class="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
      <p class="text-gray-400">Загрузка...</p>
    </div>

    <div v-else-if="error" class="max-w-7xl mx-auto px-4 py-20 text-center">
      <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
        <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p class="text-red-400">{{ error }}</p>
      </div>
    </div>

    <div v-else-if="schematic" class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Основной контент -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Превью -->
          <div class="bg-dark-card rounded-xl overflow-hidden">
            <img 
              :src="schematic.imageUrl" 
              :alt="schematic.title"
              class="w-full aspect-video object-cover"
            />
          </div>

          <!-- Заголовок и теги -->
          <div>
            <h1 class="text-3xl font-bold text-white mb-4">{{ schematic.title }}</h1>
            <div v-if="schematic.tags && schematic.tags.length > 0" class="flex flex-wrap gap-2">
              <span v-for="tag in schematic.tags" :key="tag.id" 
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {{ tag.name }}
              </span>
            </div>
          </div>

          <!-- Описание -->
          <div class="bg-dark-card rounded-xl p-6">
            <h2 class="text-xl font-semibold text-white mb-4">Описание</h2>
            <p class="text-gray-300 whitespace-pre-wrap leading-relaxed">{{ schematic.description }}</p>
          </div>

          <!-- Файлы -->
          <div class="bg-dark-card rounded-xl p-6">
            <h2 class="text-xl font-semibold text-white mb-4">Файлы</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                <div class="flex items-center gap-3">
                  <Icon name="heroicons:document" class="w-6 h-6 text-primary" />
                  <div>
                    <p class="text-white font-medium">{{ schematic.title }}.schem</p>
                    <p class="text-gray-400 text-sm">Файл схематика</p>
                  </div>
                </div>
                <button
                  @click="handleDownload"
                  :disabled="downloading"
                  class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                >
                  <Icon :name="downloading ? 'heroicons:arrow-path' : 'heroicons:arrow-down-tray'" 
                    :class="{ 'animate-spin': downloading }" class="w-5 h-5" />
                  {{ downloading ? 'Загрузка...' : 'Скачать' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Боковая панель -->
        <div class="space-y-6">
          <!-- Автор -->
          <div class="bg-dark-card rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Автор</h3>
            <NuxtLink :to="`/users/${schematic.author.id}`" 
              class="flex items-center gap-3 hover:bg-dark-hover p-3 rounded-lg transition">
              <img 
                :src="schematic.author.image || defaultAvatar" 
                :alt="schematic.author.name"
                class="w-12 h-12 rounded-full"
              />
              <div>
                <p class="text-white font-medium">{{ schematic.author.name }}</p>
                <p class="text-gray-400 text-sm">@{{ schematic.author.username }}</p>
              </div>
            </NuxtLink>
          </div>

          <!-- Статистика -->
          <div class="bg-dark-card rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Статистика</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-400 flex items-center gap-2">
                  <Icon name="heroicons:heart" class="w-5 h-5" />
                  Лайков
                </span>
                <span class="text-white font-semibold">{{ schematic.likes }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400 flex items-center gap-2">
                  <Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
                  Скачиваний
                </span>
                <span class="text-white font-semibold">{{ schematic.downloads }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400 flex items-center gap-2">
                  <Icon name="heroicons:eye" class="w-5 h-5" />
                  Просмотров
                </span>
                <span class="text-white font-semibold">{{ schematic.views }}</span>
              </div>
            </div>
          </div>

          <!-- Действия -->
          <div class="space-y-3">
            <button
              @click="handleLike"
              :disabled="likePending"
              :class="[
                'w-full py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2',
                isLiked 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-dark-card hover:bg-dark-hover text-white border border-dark-border'
              ]"
            >
              <Icon :name="likePending ? 'heroicons:arrow-path' : 'heroicons:heart'" 
                :class="['w-5 h-5', { 'animate-spin': likePending, 'fill-current': isLiked }]" />
              {{ isLiked ? 'Убрать лайк' : 'Лайкнуть' }}
            </button>
          </div>

          <!-- Категория -->
          <div class="bg-dark-card rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Категория</h3>
            <div class="space-y-2">
              <NuxtLink :to="`/?category=${schematic.category.slug}`"
                class="block px-3 py-2 bg-dark-bg hover:bg-dark-hover rounded-lg transition">
                <p class="text-white">{{ schematic.category.name }}</p>
              </NuxtLink>
              <NuxtLink v-if="schematic.subcategory" 
                :to="`/?category=${schematic.category.slug}&subcategory=${schematic.subcategory.slug}`"
                class="block px-3 py-2 bg-dark-bg hover:bg-dark-hover rounded-lg transition">
                <p class="text-gray-300 text-sm">{{ schematic.subcategory.name }}</p>
              </NuxtLink>
            </div>
          </div>

          <!-- Дата -->
          <div class="bg-dark-card rounded-xl p-6">
            <div class="space-y-3 text-sm">
              <div>
                <p class="text-gray-400">Опубликовано</p>
                <p class="text-white">{{ formatDate(schematic.createdAt) }}</p>
              </div>
              <div>
                <p class="text-gray-400">Обновлено</p>
                <p class="text-white">{{ formatDate(schematic.updatedAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schematic } from '~/types'
import defaultAvatar from '~/assets/pic/default-avatar.png'
const route = useRoute()
const api = useApi()
const auth = useAuth()
const toast = useToast()

const schematic = ref<Schematic | null>(null)
const loading = ref(true)
const error = ref('')
const downloading = ref(false)
const likePending = ref(false)
const isLiked = ref(false)

const loadSchematic = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await api.getSchematic(route.params.id as string)
    schematic.value = response.schematic
    isLiked.value = false
  } catch (e: any) {
    error.value = e.message || 'Не удалось загрузить схематик'
  } finally {
    loading.value = false
  }
}

const handleDownload = async () => {
  if (!schematic.value) return
  try {
    downloading.value = true
    const result = await api.downloadSchematic(schematic.value.id)
    window.open(result.fileUrl, '_blank')
    if (schematic.value) {
      schematic.value.downloads++
    }
    toast.success('Скачивание начато')
  } catch (e: any) {
    toast.error('Ошибка скачивания: ' + e.message)
  } finally {
    downloading.value = false
  }
}

const handleLike = async () => {
  if (!auth.isAuthenticated.value) {
    toast.warning('Войдите, чтобы лайкать схематики')
    return
  }
  if (!schematic.value) return
  
  try {
    likePending.value = true
    const result = await api.likeSchematic(schematic.value.id)
    isLiked.value = result.liked
    schematic.value.likes = result.likes
    toast.success(result.liked ? 'Лайк добавлен' : 'Лайк убран')
  } catch (e: any) {
    toast.error('Ошибка: ' + e.message)
  } finally {
    likePending.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(() => {
  loadSchematic()
})
</script>
