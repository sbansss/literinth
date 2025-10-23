<template>
  <div class="min-h-screen bg-dark-bg">
    <Header />
    
    <div v-if="loading" class="max-w-7xl mx-auto px-4 py-20 text-center">
      <Icon name="heroicons:arrow-path" class="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
      <p class="text-gray-400">Загрузка профиля...</p>
    </div>

    <div v-else-if="error" class="max-w-7xl mx-auto px-4 py-20 text-center">
      <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
        <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p class="text-red-400">{{ error }}</p>
      </div>
    </div>

    <div v-else-if="user" class="max-w-7xl mx-auto px-4 py-8">
      <!-- Профиль -->
      <div class="bg-dark-card rounded-xl p-8 mb-8">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-6">
            <img 
              :src="user.image || defaultAvatar" 
              :alt="user.name"
              class="w-24 h-24 rounded-full"
            />
            <div>
              <h1 class="text-3xl font-bold text-white mb-2">{{ user.name }}</h1>
              <p class="text-gray-400 text-lg">@{{ user.username }}</p>
              <div class="flex items-center gap-6 mt-4 text-sm">
                <div>
                  <span class="text-gray-400">Схематиков</span>
                  <span class="text-white font-semibold ml-2">{{ userSchematics.length }}</span>
                </div>
                <div>
                  <span class="text-gray-400">Всего лайков</span>
                  <span class="text-white font-semibold ml-2">{{ totalLikes }}</span>
                </div>
                <div>
                  <span class="text-gray-400">Скачиваний</span>
                  <span class="text-white font-semibold ml-2">{{ totalDownloads }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Схематики пользователя -->
      <div>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white">Схематики пользователя</h2>
          
          <!-- Сортировка -->
          <div class="flex items-center gap-4">
            <select v-model="sortBy"
              class="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:border-primary focus:outline-none">
              <option value="recent">Новые</option>
              <option value="popular">Популярные</option>
              <option value="downloads">По скачиваниям</option>
            </select>

            <!-- Вид -->
            <div class="flex bg-dark-card border border-dark-border rounded-lg overflow-hidden">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'px-3 py-2 transition',
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                ]"
              >
                <Icon name="heroicons:squares-2x2" class="w-5 h-5" />
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'px-3 py-2 transition',
                  viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                ]"
              >
                <Icon name="heroicons:bars-3" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="loadingSchematics" class="text-center py-12">
          <Icon name="heroicons:arrow-path" class="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p class="text-gray-400">Загрузка схематиков...</p>
        </div>

        <div v-else-if="sortedSchematics.length === 0" class="text-center py-12">
          <Icon name="heroicons:cube-transparent" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p class="text-gray-400">У пользователя пока нет схематиков</p>
        </div>

        <!-- Сетка -->
        <div v-else-if="viewMode === 'grid'" 
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SchematicCard 
            v-for="schematic in sortedSchematics" 
            :key="schematic.id"
            :schematic="schematic"
            @like="handleLike"
            @download="handleDownload"
          />
        </div>

        <!-- Список -->
        <div v-else class="space-y-4">
          <NuxtLink 
            v-for="schematic in sortedSchematics" 
            :key="schematic.id"
            :to="`/schematics/${schematic.id}`"
            class="flex gap-6 bg-dark-card hover:bg-dark-hover rounded-xl p-6 transition"
          >
            <img 
              :src="schematic.imageUrl" 
              :alt="schematic.title"
              class="w-40 h-24 object-cover rounded-lg flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h3 class="text-xl font-semibold text-white mb-2 truncate">{{ schematic.title }}</h3>
              <p class="text-gray-400 text-sm mb-3 line-clamp-2">{{ schematic.description }}</p>
              <div v-if="schematic.tags && schematic.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
                <span v-for="tag in schematic.tags.slice(0, 3)" :key="tag.id" 
                  class="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  {{ tag.name }}
                </span>
              </div>
            </div>
            <div class="flex flex-col justify-between items-end flex-shrink-0">
              <div class="flex items-center gap-4 text-sm text-gray-400">
                <span class="flex items-center gap-1">
                  <Icon name="heroicons:heart" class="w-4 h-4" />
                  {{ schematic.likes }}
                </span>
                <span class="flex items-center gap-1">
                  <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
                  {{ schematic.downloads }}
                </span>
              </div>
              <span class="text-xs text-gray-500">
                {{ formatDate(schematic.createdAt) }}
              </span>
            </div>
          </NuxtLink>
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
const toast = useToast()

interface User {
  id: string
  name: string
  username: string
  image: string | null
}

const user = ref<User | null>(null)
const userSchematics = ref<Schematic[]>([])
const loading = ref(true)
const loadingSchematics = ref(true)
const error = ref('')
const sortBy = ref('recent')
const viewMode = ref<'grid' | 'list'>('grid')

const totalLikes = computed(() => {
  return userSchematics.value.reduce((sum, s) => sum + s.likes, 0)
})

const totalDownloads = computed(() => {
  return userSchematics.value.reduce((sum, s) => sum + s.downloads, 0)
})

const sortedSchematics = computed(() => {
  const schematics = [...userSchematics.value]
  switch (sortBy.value) {
    case 'popular':
      return schematics.sort((a, b) => b.likes - a.likes)
    case 'downloads':
      return schematics.sort((a, b) => b.downloads - a.downloads)
    case 'recent':
    default:
      return schematics.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }
})

const loadUser = async () => {
  try {
    loading.value = true
    error.value = ''
    // TODO: добавить endpoint для получения юзера по ID
    // Временно загружаем схематики и берём автора из первого
    const response = await api.getSchematics({ perPage: 100 })
    const userId = route.params.id as string
    
    // Находим схематики пользователя
    userSchematics.value = response.data.filter(s => s.author.id === userId)
    
    if (userSchematics.value.length > 0) {
      user.value = userSchematics.value[0].author
    } else {
      error.value = 'Пользователь не найден'
    }
  } catch (e: any) {
    error.value = e.message || 'Ошибка загрузки профиля'
  } finally {
    loading.value = false
    loadingSchematics.value = false
  }
}

const handleLike = async (id: string) => {
  try {
    const result = await api.likeSchematic(id)
    const schematic = userSchematics.value.find(s => s.id === id)
    if (schematic) {
      schematic.likes = result.likes
    }
    toast.success(result.liked ? 'Лайк добавлен' : 'Лайк убран')
  } catch (e: any) {
    toast.error('Ошибка: ' + e.message)
  }
}

const handleDownload = async (id: string) => {
  try {
    const result = await api.downloadSchematic(id)
    window.open(result.fileUrl, '_blank')
    const schematic = userSchematics.value.find(s => s.id === id)
    if (schematic) {
      schematic.downloads++
    }
    toast.success('Скачивание начато')
  } catch (e: any) {
    toast.error('Ошибка: ' + e.message)
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
  loadUser()
})
</script>
