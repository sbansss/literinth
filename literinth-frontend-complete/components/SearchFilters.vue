<template>
  <div class="space-y-4">
    <!-- Поиск -->
    <div class="relative">
      <input
        :value="search"
        @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Найти ферму/механизм..."
        class="w-full bg-dark-card text-gray-200 placeholder-gray-500 px-4 py-3 pl-10 rounded-lg border border-dark-border focus:border-primary focus:outline-none transition"
      />
      <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
    </div>

    <!-- Фильтры -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-3">
        <!-- Сортировка -->
        <select
          :value="sort"
          @change="$emit('update:sort', ($event.target as HTMLSelectElement).value)"
          class="px-4 py-2.5 bg-dark-card border border-dark-border rounded-lg text-white focus:border-primary focus:outline-none cursor-pointer hover:bg-dark-hover transition"
        >
          <option value="popular">Популярные</option>
          <option value="recent">Новые</option>
          <option value="downloads">По скачиваниям</option>
          <option value="likes">По лайкам</option>
        </select>

        <!-- Количество на странице -->
        <select
          :value="perPage"
          @change="$emit('update:perPage', Number(($event.target as HTMLSelectElement).value))"
          class="px-4 py-2.5 bg-dark-card border border-dark-border rounded-lg text-white focus:border-primary focus:outline-none cursor-pointer hover:bg-dark-hover transition"
        >
          <option :value="12">12 на стр</option>
          <option :value="24">24 на стр</option>
          <option :value="48">48 на стр</option>
          <option :value="96">96 на стр</option>
        </select>
      </div>

      <!-- Переключатель вида -->
      <div class="flex items-center gap-1 bg-dark-card border border-dark-border rounded-lg p-1">
        <button
          @click="$emit('update:view', 'grid')"
          :class="[
            'p-2 rounded transition',
            view === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
          ]"
          title="Сетка"
        >
          <Icon name="heroicons:squares-2x2" class="w-5 h-5" />
        </button>
        <button
          @click="$emit('update:view', 'list')"
          :class="[
            'p-2 rounded transition',
            view === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
          ]"
          title="Список"
        >
          <Icon name="heroicons:bars-3" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  search?: string
  sort?: string
  perPage?: number
  view?: 'grid' | 'list'
}

withDefaults(defineProps<Props>(), {
  search: '',
  sort: 'popular',
  perPage: 12,
  view: 'grid'
})

defineEmits<{
  'update:search': [value: string]
  'update:sort': [value: string]
  'update:perPage': [value: number]
  'update:view': [value: 'grid' | 'list']
}>()
</script>
