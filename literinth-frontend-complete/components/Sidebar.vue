<template>
  <aside class="w-64 bg-dark-bg p-4">
    <!-- Категории -->
    <div class="mb-8">
      <h2 class="text-white font-bold text-lg mb-4 font-display">Категории</h2>
      <ul class="space-y-1">
        <li v-for="category in categories" :key="category.id">
          <button
            @click="selectCategory(category.id)"
            :class="[
              'w-full text-left px-3 py-2 rounded-lg transition-colors',
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:bg-dark-hover'
            ]"
          >
            {{ category.name }}
          </button>

          <!-- Подкатегории -->
          <ul
            v-if="category.subcategories && category.subcategories.length > 0 && selectedCategory === category.id"
            class="ml-4 mt-2 space-y-1"
          >
            <li v-for="subcategory in category.subcategories" :key="subcategory.id">
              <button
                @click="selectSubcategory(subcategory.id)"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  selectedSubcategory === subcategory.id
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:bg-dark-hover hover:text-gray-200'
                ]"
              >
                {{ subcategory.name }}
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </div>


  </aside>
</template>

<script setup lang="ts">
import type { Category } from '~/types'

interface Props {
  categories: Category[]
  selectedCategory?: string
  selectedSubcategory?: string
}

defineProps<Props>()

const emit = defineEmits<{
  categoryChange: [categoryId: string]
  subcategoryChange: [subcategoryId: string]
}>()

const selectCategory = (categoryId: string) => {
  emit('categoryChange', categoryId)
}

const selectSubcategory = (subcategoryId: string) => {
  emit('subcategoryChange', subcategoryId)
}
</script>
