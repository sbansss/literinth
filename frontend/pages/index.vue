<template>
  <div class="min-h-screen bg-dark-bg">
    <Header />
    <TabsNavigation :activeTab="activeTab" @change="handleTabChange" />
    
    <div class="container mx-auto px-4 py-6">
      <div class="flex gap-6">
        <!-- Сайдбар -->
        <Sidebar
          :categories="categories"
          :selectedCategory="selectedCategory"
          :selectedSubcategory="selectedSubcategory"
          @categoryChange="handleCategoryChange"
          @subcategoryChange="handleSubcategoryChange"
        />

        <!-- Основной контент -->
        <main class="flex-1">
          <!-- Поиск и фильтры -->
          <SearchFilters
            :currentPage="currentPage"
            :perPage="perPage"
            :sort="sort"
            :view="viewMode"
            @search="handleSearch"
            @sortChange="handleSortChange"
            @perPageChange="handlePerPageChange"
            @pageChange="handlePageChange"
            @viewChange="handleViewChange"
            class="mb-6"
          />

          <!-- Сетка схематиков -->
          <div v-if="!loading && viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SchematicCard
              v-for="schematic in schematics"
              :key="schematic.id"
              :schematic="schematic"
            />
          </div>

          <!-- Список схематиков -->
          <div v-if="!loading && viewMode === 'list'" class="space-y-4">
            <SchematicListItem
              v-for="schematic in schematics"
              :key="schematic.id"
              :schematic="schematic"
            />
          </div>

          <!-- Загрузка -->
          <div v-else class="flex items-center justify-center py-20">
            <div class="text-gray-400">Загрузка...</div>
          </div>

          <!-- Пустой список -->
          <div v-if="!loading && schematics.length === 0" class="text-center py-20">
            <p class="text-gray-400 text-lg">Схематики не найдены</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schematic, Category, TabType, SortOption } from '~/types'

// Состояние
const activeTab = ref<TabType>('redstone')
const categories = ref<Category[]>([])
const schematics = ref<Schematic[]>([])
const loading = ref(false)

// Фильтры
const selectedCategory = ref<string>('shitpost')
const selectedSubcategory = ref<string>('shitpost-archive')
const searchQuery = ref<string>('')
const sort = ref<SortOption>('popular')
const currentPage = ref(1)
const perPage = ref(20)
const viewMode = ref<'grid' | 'list'>('grid')

// API
const api = useApi()

// Загрузка данных
const loadData = async () => {
  loading.value = true
  try {
    // Загрузка категорий
    categories.value = await api.getCategories()
    
    // Загрузка схематиков
    const response = await api.getSchematics({
      page: currentPage.value,
      perPage: perPage.value,
      category: selectedCategory.value,
      subcategory: selectedSubcategory.value,
      search: searchQuery.value,
      sort: sort.value
    })
    
    schematics.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  } finally {
    loading.value = false
  }
}

// Обработчики
const handleTabChange = (tab: TabType) => {
  activeTab.value = tab
  loadData()
}

const handleCategoryChange = (categoryId: string) => {
  selectedCategory.value = categoryId
  selectedSubcategory.value = ''
  currentPage.value = 1
  loadData()
}

const handleSubcategoryChange = (subcategoryId: string) => {
  selectedSubcategory.value = subcategoryId
  currentPage.value = 1
  loadData()
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  currentPage.value = 1
  loadData()
}

const handleSortChange = (newSort: SortOption) => {
  sort.value = newSort
  currentPage.value = 1
  loadData()
}

const handlePerPageChange = (newPerPage: number) => {
  perPage.value = newPerPage
  currentPage.value = 1
  loadData()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadData()
}

const handleViewChange = (view: 'grid' | 'list') => {
  viewMode.value = view
}

// Инициализация
onMounted(() => {
  loadData()
})
</script>
