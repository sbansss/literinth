<template>
  <div class="min-h-screen bg-dark-bg">
    <Header />
    
    <div v-if="!auth.isAuthenticated.value" class="max-w-7xl mx-auto px-4 py-20 text-center">
      <div class="bg-dark-card rounded-xl p-8 max-w-md mx-auto">
        <Icon name="heroicons:lock-closed" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-white mb-4">Требуется авторизация</h2>
        <p class="text-gray-400 mb-6">Войдите, чтобы получить доступ к личному кабинету</p>
        <NuxtLink to="/login" 
          class="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition">
          Войти
        </NuxtLink>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 py-8">
      <!-- Профиль -->
      <div class="bg-dark-card rounded-xl p-8 mb-8">
        <div class="flex items-center gap-6">
          <img 
            :src="auth.user.value?.image || '/default-avatar.png'" 
            :alt="auth.user.value?.name"
            class="w-24 h-24 rounded-full"
          />
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">{{ auth.user.value?.name }}</h1>
            <p class="text-gray-400">@{{ auth.user.value?.username }}</p>
            <p class="text-gray-500 text-sm mt-1">{{ auth.user.value?.email }}</p>
          </div>
        </div>
      </div>

      <!-- Табы -->
      <div class="flex gap-4 mb-8 border-b border-dark-border">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-6 py-3 font-semibold transition relative',
            activeTab === tab.id 
              ? 'text-primary' 
              : 'text-gray-400 hover:text-white'
          ]"
        >
          {{ tab.name }}
          <div v-if="activeTab === tab.id" 
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
        </button>
      </div>

      <!-- Мои схематики -->
      <div v-show="activeTab === 'schematics'">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white">Мои схематики</h2>
          <button
            @click="showUploadModal = true"
            class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition flex items-center gap-2"
          >
            <Icon name="heroicons:plus" class="w-5 h-5" />
            Загрузить
          </button>
        </div>

        <div v-if="loadingSchematics" class="text-center py-12">
          <Icon name="heroicons:arrow-path" class="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p class="text-gray-400">Загрузка...</p>
        </div>

        <div v-else-if="mySchematics.length === 0" class="text-center py-12">
          <Icon name="heroicons:cube-transparent" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p class="text-gray-400 mb-4">У вас пока нет схематиков</p>
          <button
            @click="showUploadModal = true"
            class="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition"
          >
            Загрузить первый
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SchematicCard 
            v-for="schematic in mySchematics" 
            :key="schematic.id"
            :schematic="schematic"
            @like="handleLike"
            @download="handleDownload"
          />
        </div>
      </div>

      <!-- Избранное -->
      <div v-show="activeTab === 'favorites'">
        <h2 class="text-2xl font-bold text-white mb-6">Избранное</h2>
        
        <div v-if="loadingFavorites" class="text-center py-12">
          <Icon name="heroicons:arrow-path" class="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p class="text-gray-400">Загрузка...</p>
        </div>

        <div v-else-if="favorites.length === 0" class="text-center py-12">
          <Icon name="heroicons:heart" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p class="text-gray-400">Нет избранных схематиков</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SchematicCard 
            v-for="schematic in favorites" 
            :key="schematic.id"
            :schematic="schematic"
            @like="handleLike"
            @download="handleDownload"
          />
        </div>
      </div>
    </div>

    <!-- Модалка загрузки -->
    <div v-if="showUploadModal" 
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      @click.self="showUploadModal = false">
      <div class="bg-dark-card rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-white">Загрузить схематик</h3>
          <button @click="showUploadModal = false" 
            class="text-gray-400 hover:text-white transition">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="handleUpload" class="space-y-6">
          <div>
            <label class="block text-white font-medium mb-2">Название</label>
            <input v-model="uploadForm.title" type="text" required
              class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-primary focus:outline-none"
              placeholder="Автоферма пшеницы"
            />
          </div>

          <div>
            <label class="block text-white font-medium mb-2">Описание</label>
            <textarea v-model="uploadForm.description" required rows="4"
              class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-primary focus:outline-none resize-none"
              placeholder="Полностью автоматическая ферма с сортировкой..."
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-white font-medium mb-2">Категория</label>
              <select v-model="uploadForm.categoryId" required
                class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-primary focus:outline-none">
                <option value="">Выберите</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-white font-medium mb-2">Подкатегория</label>
              <select v-model="uploadForm.subcategoryId"
                class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-primary focus:outline-none">
                <option value="">Нет</option>
                <option v-for="sub in selectedCategorySubcats" :key="sub.id" :value="sub.id">
                  {{ sub.name }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-white font-medium mb-2">Файл (.schem/.litematic)</label>
            <input type="file" @change="handleFileSelect" accept=".schem,.litematic" required
              class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
            />
          </div>

          <div>
            <label class="block text-white font-medium mb-2">Изображение</label>
            <input type="file" @change="handleImageSelect" accept="image/*" required
              class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
            />
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="uploading"
              class="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Icon :name="uploading ? 'heroicons:arrow-path' : 'heroicons:arrow-up-tray'" 
                :class="{ 'animate-spin': uploading }" class="w-5 h-5" />
              {{ uploading ? 'Загрузка...' : 'Загрузить' }}
            </button>
            <button
              type="button"
              @click="showUploadModal = false"
              class="px-6 py-3 bg-dark-bg hover:bg-dark-hover text-white rounded-lg font-semibold transition"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schematic, Category } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const auth = useAuth()
const api = useApi()
const toast = useToast()

const tabs = [
  { id: 'schematics', name: 'Мои схематики' },
  { id: 'favorites', name: 'Избранное' }
]

const activeTab = ref('schematics')
const mySchematics = ref<Schematic[]>([])
const favorites = ref<Schematic[]>([])
const loadingSchematics = ref(true)
const loadingFavorites = ref(false)
const showUploadModal = ref(false)
const uploading = ref(false)
const categories = ref<Category[]>([])

const uploadForm = ref({
  title: '',
  description: '',
  categoryId: '',
  subcategoryId: '',
  file: null as File | null,
  image: null as File | null
})

const selectedCategorySubcats = computed(() => {
  if (!uploadForm.value.categoryId) return []
  const cat = categories.value.find(c => c.id === uploadForm.value.categoryId)
  return cat?.subcategories || []
})

const loadCategories = async () => {
  try {
    const response = await api.getCategories()
    categories.value = response.categories
  } catch (e) {
    console.error('Ошибка загрузки категорий:', e)
  }
}

const loadMySchematics = async () => {
  try {
    loadingSchematics.value = true
    // TODO: добавить endpoint для схематиков юзера
    const response = await api.getSchematics({ perPage: 100 })
    // Фильтруем по автору (временно)
    mySchematics.value = response.data.filter(s => s.author.id === auth.user.value?.id)
  } catch (e) {
    console.error('Ошибка:', e)
  } finally {
    loadingSchematics.value = false
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadForm.value.file = target.files[0]
  }
}

const handleImageSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadForm.value.image = target.files[0]
  }
}

const handleUpload = async () => {
  if (!uploadForm.value.file || !uploadForm.value.image) {
    toast.warning('Выберите файл и изображение')
    return
  }

  try {
    uploading.value = true
    
    const formData = new FormData()
    formData.append('title', uploadForm.value.title)
    formData.append('description', uploadForm.value.description)
    formData.append('categoryId', uploadForm.value.categoryId)
    if (uploadForm.value.subcategoryId) {
      formData.append('subcategoryId', uploadForm.value.subcategoryId)
    }
    formData.append('file', uploadForm.value.file)
    formData.append('image', uploadForm.value.image)

    await api.createSchematic(formData)
    
    showUploadModal.value = false
    uploadForm.value = {
      title: '',
      description: '',
      categoryId: '',
      subcategoryId: '',
      file: null,
      image: null
    }
    
    await loadMySchematics()
    toast.success('Схематик успешно загружен!')
    
  } catch (e: any) {
    toast.error('Ошибка загрузки: ' + e.message)
  } finally {
    uploading.value = false
  }
}

const handleLike = async (id: string) => {
  try {
    const result = await api.likeSchematic(id)
    const updateSchematic = (list: Schematic[]) => {
      const schematic = list.find(s => s.id === id)
      if (schematic) {
        schematic.likes = result.likes
      }
    }
    updateSchematic(mySchematics.value)
    updateSchematic(favorites.value)
    toast.success(result.liked ? 'Лайк добавлен' : 'Лайк убран')
  } catch (e: any) {
    toast.error('Ошибка: ' + e.message)
  }
}

const handleDownload = async (id: string) => {
  try {
    const result = await api.downloadSchematic(id)
    window.open(result.fileUrl, '_blank')
    
    const updateDownloads = (list: Schematic[]) => {
      const schematic = list.find(s => s.id === id)
      if (schematic) schematic.downloads++
    }
    updateDownloads(mySchematics.value)
    updateDownloads(favorites.value)
    toast.success('Скачивание начато')
  } catch (e: any) {
    toast.error('Ошибка: ' + e.message)
  }
}

watch(activeTab, async (newTab) => {
  if (newTab === 'favorites' && favorites.value.length === 0) {
    // TODO: загрузить избранное
  }
})

onMounted(() => {
  loadCategories()
  loadMySchematics()
})
</script>
