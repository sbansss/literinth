<template>
  <div class="space-y-4">
    <!-- Поиск -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Найти ферму/механизм"
        class="w-full bg-dark-card text-gray-200 placeholder-gray-500 px-4 py-3 pl-10 rounded-lg border border-dark-border focus:border-primary focus:outline-none transition-colors"
        @input="handleSearch"
      />
      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>

    <!-- Фильтры -->
    <div class="flex items-center gap-4 flex-wrap">
      <!-- Сортировка -->
      <Dropdown
        v-model="selectedSort"
        :options="sortOptions"
        @update:modelValue="handleSortChange"
      />

      <!-- Количество на странице -->
      <Dropdown
        v-model="selectedPerPage"
        :options="perPageOptions"
        @update:modelValue="handlePerPageChange"
      />

      <!-- Переключатель вида -->
      <div class="flex items-center gap-1 bg-dark-card border border-dark-border rounded-lg p-1">
        <button
          @click="$emit('viewChange', 'grid')"
          :class="[
            'p-2 rounded transition-colors',
            view === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-200'
          ]"
          title="Сетка"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          @click="$emit('viewChange', 'list')"
          :class="[
            'p-2 rounded transition-colors',
            view === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-200'
          ]"
          title="Список"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Активные фильтры -->
      <div v-if="activeFilters.length > 0" class="flex items-center gap-2">
        <span
          v-for="filter in activeFilters"
          :key="filter"
          class="flex items-center gap-2 bg-dark-card px-3 py-1 rounded-lg text-sm border border-dark-border"
        >
          {{ filter }}
          <button @click="removeFilter(filter)" class="text-gray-400 hover:text-white">
            ✕
          </button>
        </span>
      </div>

      <!-- Пагинация -->
      <div class="ml-auto flex items-center gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="w-8 h-8 rounded-lg bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
        >
          1
        </button>
        <span class="text-gray-400">2 – ...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SortOption } from '~/types'

interface Props {
  currentPage?: number
  perPage?: number
  sort?: SortOption
  view?: 'grid' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  perPage: 20,
  sort: 'popular',
  view: 'grid'
})

const emit = defineEmits<{
  search: [query: string]
  sortChange: [sort: SortOption]
  perPageChange: [perPage: number]
  pageChange: [page: number]
  viewChange: [view: 'grid' | 'list']
}>()

const searchQuery = ref('')
const activeFilters = ref(['Щитпост'])

// Опции для сортировки
const sortOptions = [
  { value: 'popular', label: 'Популярное' },
  { value: 'recent', label: 'Недавние' },
  { value: 'downloads', label: 'По загрузкам' },
  { value: 'likes', label: 'По лайкам' }
]

// Опции для количества на странице
const perPageOptions = [
  { value: 10, label: 'На страницу: 10' },
  { value: 20, label: 'На страницу: 20' },
  { value: 50, label: 'На страницу: 50' },
  { value: 100, label: 'На страницу: 100' }
]

const selectedSort = ref(props.sort)
const selectedPerPage = ref(props.perPage)

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const handleSortChange = (newSort: string | number) => {
  emit('sortChange', newSort as SortOption)
}

const handlePerPageChange = (newPerPage: string | number) => {
  emit('perPageChange', newPerPage as number)
}

const removeFilter = (filter: string) => {
  activeFilters.value = activeFilters.value.filter(f => f !== filter)
}

const prevPage = () => {
  if (props.currentPage > 1) {
    emit('pageChange', props.currentPage - 1)
  }
}

// Синхронизация с props
watch(() => props.sort, (newSort) => {
  selectedSort.value = newSort
})

watch(() => props.perPage, (newPerPage) => {
  selectedPerPage.value = newPerPage
})
</script>
