<template>
  <div class="min-h-screen bg-dark-bg">
    <Header />
    
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Боковая панель -->
        <aside class="lg:w-64 flex-shrink-0">
          <Sidebar 
            :categories="categories"
            :selected-category="selectedCategory ?? undefined"
            :selected-subcategory="selectedSubcategory ?? undefined"
            @update:category="handleCategoryChange"
            @update:subcategory="handleSubcategoryChange"
          />
        </aside>

        <!-- Основной контент -->
        <main class="flex-1 min-w-0">
          <!-- Фильтры -->
          <SearchFilters 
            v-model:search="searchQuery"
            v-model:sort="sortBy"
            v-model:perPage="perPage"
            v-model:view="viewMode"
            class="mb-6"
          />

          <!-- Загрузка -->
          <div v-if="loading && !schematics.length" class="text-center py-20">
            <Icon name="heroicons:arrow-path" class="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p class="text-gray-400">Загрузка схематиков...</p>
          </div>

          <!-- Ошибка -->
          <div v-else-if="error" class="text-center py-20">
            <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
              <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p class="text-red-400 mb-2 font-semibold">Ошибка загрузки</p>
              <p class="text-gray-400 text-sm mb-4">{{ error }}</p>
              <button
                @click="loadSchematics"
                class="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition"
              >
                Попробовать снова
              </button>
            </div>
          </div>

          <!-- Пусто -->
          <div v-else-if="!schematics.length" class="text-center py-20">
            <Icon name="heroicons:cube-transparent" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p class="text-gray-400">Схематики не найдены</p>
          </div>

          <!-- Сетка -->
          <div v-else-if="viewMode === 'grid'" 
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SchematicCard 
              v-for="schematic in schematics" 
              :key="schematic.id"
              :schematic="schematic"
              @like="handleLike"
              @download="handleDownload"
            />
          </div>

          <!-- Список -->
          <div v-else class="space-y-4">
            <SchematicListItem 
              v-for="schematic in schematics" 
              :key="schematic.id"
              :schematic="schematic"
            />
          </div>

          <!-- Пагинация -->
          <div v-if="pagination && pagination.totalPages > 1" 
            class="flex justify-center items-center gap-2 mt-8">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-dark-card hover:bg-dark-hover text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="heroicons:chevron-left" class="w-5 h-5" />
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-4 py-2 rounded-lg transition',
                currentPage === page 
                  ? 'bg-primary text-white' 
                  : 'bg-dark-card hover:bg-dark-hover text-white'
              ]"
            >
              {{ page }}
            </button>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === pagination.totalPages"
              class="px-4 py-2 bg-dark-card hover:bg-dark-hover text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="heroicons:chevron-right" class="w-5 h-5" />
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schematic, Category } from '~/types'
export type SortOption = 'popular' | 'recent' | 'downloads' | 'likes'


const api = useApi()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const schematics = ref<Schematic[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref('')

const searchQuery = ref('')
const sortBy = ref<SortOption>('popular')
const perPage = ref(10)
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const selectedCategory = ref<string | null>(null)
const selectedSubcategory = ref<string | null>(null)

const pagination = ref<{
  page: number
  perPage: number
  total: number
  totalPages: number
} | null>(null)

// Видимые страницы для пагинации
const visiblePages = computed(() => {
  if (!pagination.value) return []
  
  const total = pagination.value.totalPages
  const current = currentPage.value
  const pages: number[] = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5)
    } else if (current >= total - 3) {
      pages.push(total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(current - 2, current - 1, current, current + 1, current + 2)
    }
  }
  
  return pages
})

const loadCategories = async () => {
  try {
    const response = await api.getCategories()
    categories.value = response.categories
  } catch (e) {
    console.error('Ошибка загрузки категорий:', e)
  }
}

const loadSchematics = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await api.getSchematics({
      page: currentPage.value,
      perPage: perPage.value,
      category: selectedCategory.value || undefined,
      subcategory: selectedSubcategory.value || undefined,
      search: searchQuery.value || undefined,
      sort: sortBy.value
    })
    
    schematics.value = response.data
    pagination.value = response.pagination
  } catch (e: any) {
    error.value = e.message || 'Не удалось загрузить схематики'
  } finally {
    loading.value = false
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && pagination.value && page <= pagination.value.totalPages) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleCategoryChange = (slug: string | null) => {
  selectedCategory.value = slug
  selectedSubcategory.value = null
  currentPage.value = 1
  loadSchematics()
}

const handleSubcategoryChange = (slug: string | null) => {
  selectedSubcategory.value = slug
  currentPage.value = 1
  loadSchematics()
}

const handleLike = async (id: string) => {
  try {
    const result = await api.likeSchematic(id)
    const schematic = schematics.value.find(s => s.id === id)
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
    const schematic = schematics.value.find(s => s.id === id)
    if (schematic) {
      schematic.downloads++
    }
    toast.success('Скачивание начато')
  } catch (e: any) {
    toast.error('Ошибка: ' + e.message)
  }
}

// Debounce для поиска
let searchTimeout: ReturnType<typeof setTimeout>
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadSchematics()
  }, 500)
})

// Реактивная загрузка при изменении фильтров
watch([sortBy, perPage, currentPage], () => {
  loadSchematics()
})

onMounted(() => {
  loadCategories()
  loadSchematics()
})
</script>
