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
          <!-- Табы и фильтры -->
          <div class="space-y-6">
            <TabsNavigation :active-tab="activeTab as TabType" @update:tab="handleTabChange" />
            <SearchFilters 
              v-model:search="searchQuery"
              v-model:sort="sortBy as SortOption"
              @search="loadSchematics"
              @viewChange="handleViewChange"
            />
          </div>

          <!-- Статус загрузки -->
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
                class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          </div>

          <!-- Пустой список -->
          <div v-else-if="!schematics.length && !loading" class="text-center py-20">
            <Icon name="heroicons:inbox" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p class="text-gray-400 text-lg mb-2">Схематики не найдены</p>
            <p class="text-gray-500 text-sm">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>

          <!-- Сетка схематиков -->
          <div v-else class="mt-8">
            <!-- 
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <SchematicCard
                v-for="schematic in schematics"
                :key="schematic.id"
                :schematic="schematic"
                @like="handleLike"
                @download="handleDownload"
              />
            </div>-->

          <!-- Сетка схематиков -->
          <div v-if="!loading && viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SchematicCard
                v-for="schematic in schematics"
                :key="schematic.id"
                :schematic="schematic"
                @like="handleLike"
                @download="handleDownload"
              />
          </div>
          <!-- Список схематиков -->
          <div v-if="!loading && viewMode === 'list'" class="space-y-4">
              <SchematicCard
                v-for="schematic in schematics"
                :key="schematic.id"
                :schematic="schematic"
                @like="handleLike"
                @download="handleDownload"
              />
          </div>
            <!-- Пагинация -->
            <div v-if="pagination.totalPages > 1" class="mt-12 flex items-center justify-center space-x-2">
              <button
                @click="changePage(pagination.page - 1)"
                :disabled="pagination.page === 1 || loading"
                class="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-gray-300 hover:bg-dark-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="heroicons:chevron-left" class="w-5 h-5" />
              </button>

              <template v-for="page in visiblePages" :key="page">
                <button
                  v-if="page !== '...'"
                  @click="changePage(page as number)"
                  :disabled="loading"
                  :class="[
                    'px-4 py-2 rounded-lg transition-colors',
                    page === pagination.page
                      ? 'bg-primary text-white'
                      : 'bg-dark-card border border-dark-border text-gray-300 hover:bg-dark-hover'
                  ]"
                >
                  {{ page }}
                </button>
                <span v-else class="px-2 text-gray-500">...</span>
              </template>

              <button
                @click="changePage(pagination.page + 1)"
                :disabled="pagination.page === pagination.totalPages || loading"
                class="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-gray-300 hover:bg-dark-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="heroicons:chevron-right" class="w-5 h-5" />
              </button>
            </div>

            <!-- Информация о результатах -->
            <div class="mt-6 text-center text-sm text-gray-500">
              Показано {{ schematics.length }} из {{ pagination.total }} схематиков
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schematic, Category, TabType, SortOption } from '~/types'

const api = useApi()

// Состояние
const activeTab = ref('redstone')
const selectedCategory = ref<string | null>(null)
const selectedSubcategory = ref<string | null>(null)
const searchQuery = ref('')
const sortBy = ref('popular')

const schematics = ref<Schematic[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const pagination = ref({
  page: 1,
  perPage: 12,
  total: 0,
  totalPages: 0,
})

// Загрузка категорий
const loadCategories = async () => {
  try {
    const result = await api.getCategories()
    categories.value = result.categories
  } catch (err: any) {
    console.error('Ошибка загрузки категорий:', err)
  }
}

// Загрузка схематиков
const loadSchematics = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await api.getSchematics({
      page: pagination.value.page,
      perPage: pagination.value.perPage,
      category: selectedCategory.value || undefined,
      subcategory: selectedSubcategory.value || undefined,
      search: searchQuery.value || undefined,
      sort: sortBy.value,
    })

    schematics.value = result.data
    pagination.value = result.pagination
  } catch (err: any) {
    error.value = err.message || 'Не удалось загрузить схематики'
    schematics.value = []
  } finally {
    loading.value = false
  }
}

// Обработчики
const handleTabChange = (tab: string) => {
  activeTab.value = tab
  // TODO: фильтровать по типу схематика
  pagination.value.page = 1
  loadSchematics()
}

const handleCategoryChange = (categorySlug: string | null) => {
  selectedCategory.value = categorySlug
  selectedSubcategory.value = null
  pagination.value.page = 1
  loadSchematics()
}

const handleSubcategoryChange = (subcategorySlug: string | null) => {
  selectedSubcategory.value = subcategorySlug
  pagination.value.page = 1
  loadSchematics()
}

const changePage = (page: number) => {
  pagination.value.page = page
  loadSchematics()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleLike = async (schematicId: string) => {
  try {
    const result = await api.likeSchematic(schematicId)
    
    // Обновляем локальное состояние
    const schematic = schematics.value.find(s => s.id === schematicId)
    if (schematic) {
      schematic.likes = result.likes
      schematic.isLiked = result.liked
    }
  } catch (err: any) {
    console.error('Ошибка лайка:', err)
    // Можно показать toast с ошибкой
  }
}

const handleDownload = async (schematicId: string) => {
  try {
    const result = await api.downloadSchematic(schematicId)
    
    // Обновляем счетчик загрузок
    const schematic = schematics.value.find(s => s.id === schematicId)
    if (schematic) {
      schematic.downloads++
    }
    
    // Открываем файл для скачивания
    if (result.fileUrl) {
      window.open(result.fileUrl, '_blank')
    }
  } catch (err: any) {
    console.error('Ошибка скачивания:', err)
  }
}

// Вычисляемые свойства для пагинации
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = pagination.value.totalPages
  const current = pagination.value.page

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})
const handleViewChange = (view: 'grid' | 'list') => {
  viewMode.value = view
}
// Загрузка данных при монтировании
onMounted(() => {
  loadCategories()
  loadSchematics()
})

let timeout: ReturnType<typeof setTimeout>

watch([searchQuery, sortBy], () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    pagination.value.page = 1
    loadSchematics()
  }, 500)
})

</script>
