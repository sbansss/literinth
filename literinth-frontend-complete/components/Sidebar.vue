<template>
  <aside class="bg-dark-card rounded-xl p-6 sticky top-4">
    <h2 class="text-white font-bold text-xl mb-6 flex items-center gap-2">
      <Icon name="heroicons:squares-2x2" class="w-6 h-6 text-primary" />
      Категории
    </h2>

    <!-- Кнопка "Все" -->
    <button
      @click="selectCategory(null)"
      :class="[
        'w-full text-left px-4 py-3 rounded-lg transition-all mb-2 flex items-center justify-between group',
        !selectedCategory
          ? 'bg-primary text-white shadow-lg shadow-primary/20'
          : 'text-gray-300 hover:bg-dark-hover hover:text-white'
      ]"
    >
      <span class="font-medium">Все схематики</span>
      <Icon name="heroicons:chevron-right" 
        :class="['w-5 h-5 transition-transform', !selectedCategory ? 'rotate-90' : 'group-hover:translate-x-1']" />
    </button>

    <div class="h-px bg-dark-border my-4"></div>

    <!-- Список категорий -->
    <ul class="space-y-1">
      <li v-for="category in categories" :key="category.id">
        <button
          @click="selectCategory(category.slug)"
          :class="[
            'w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group',
            selectedCategory === category.slug
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'text-gray-300 hover:bg-dark-hover hover:text-white'
          ]"
        >
          <span class="font-medium">{{ category.name }}</span>
          <Icon name="heroicons:chevron-right" 
            :class="[
              'w-5 h-5 transition-transform',
              selectedCategory === category.slug ? 'rotate-90' : 'group-hover:translate-x-1'
            ]" />
        </button>

        <!-- Подкатегории -->
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <ul
            v-if="category.subcategories && category.subcategories.length > 0 && selectedCategory === category.slug"
            class="ml-4 mt-2 space-y-1 border-l-2 border-dark-border pl-3"
          >
            <li v-for="subcategory in category.subcategories" :key="subcategory.id">
              <button
                @click.stop="selectSubcategory(subcategory.slug)"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 group',
                  selectedSubcategory === subcategory.slug
                    ? 'bg-primary/20 text-primary font-medium'
                    : 'text-gray-400 hover:bg-dark-hover hover:text-white'
                ]"
              >
                <Icon name="heroicons:arrow-right" 
                  :class="[
                    'w-4 h-4 transition-transform',
                    selectedSubcategory === subcategory.slug ? 'translate-x-1' : 'group-hover:translate-x-1'
                  ]" />
                {{ subcategory.name }}
              </button>
            </li>
          </ul>
        </Transition>
      </li>
    </ul>
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
  'update:category': [slug: string | null]
  'update:subcategory': [slug: string | null]
}>()

const selectCategory = (slug: string | null) => {
  emit('update:category', slug)
  emit('update:subcategory', null)
}

const selectSubcategory = (slug: string | null) => {
  emit('update:subcategory', slug)
}
</script>
