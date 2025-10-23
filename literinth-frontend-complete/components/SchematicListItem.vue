<template>
  <NuxtLink 
    :to="`/schematics/${schematic.id}`"
    class="flex gap-6 bg-dark-card hover:bg-dark-hover rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group"
  >
    <!-- Превью -->
    <div class="relative w-52 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
      <img 
        :src="schematic.imageUrl" 
        :alt="schematic.title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
      
      <!-- Категория -->
      <div class="absolute top-2 left-2">
        <span class="px-2 py-1 bg-dark-bg/90 backdrop-blur-sm text-primary text-xs font-semibold rounded-full border border-primary/30">
          {{ schematic.category.name }}
        </span>
      </div>
    </div>

    <!-- Контент -->
    <div class="flex-1 min-w-0 flex flex-col">
      <!-- Заголовок -->
      <h3 class="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
        {{ schematic.title }}
      </h3>

      <!-- Описание -->
      <p class="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
        {{ schematic.description }}
      </p>
      
      <!-- Теги -->
      <div v-if="schematic.tags && schematic.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span v-for="tag in schematic.tags.slice(0, 5)" :key="tag.id" 
          class="px-2.5 py-1 bg-dark-bg text-primary rounded-full text-xs border border-dark-border hover:border-primary/50 transition-colors">
          {{ tag.name }}
        </span>
        <span v-if="schematic.tags.length > 5" class="px-2.5 py-1 text-gray-500 text-xs">
          +{{ schematic.tags.length - 5 }}
        </span>
      </div>

      <!-- Автор и статистика -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Автор -->
          <div class="flex items-center gap-2">
            <img 
              :src="schematic.author.image || defaultAvatar" 
              :alt="schematic.author.name"
              class="w-8 h-8 rounded-full ring-2 ring-dark-border group-hover:ring-primary transition-colors"
            />
            <div>
              <p class="text-xs text-gray-500">Сделал:</p>
              <p class="text-white text-sm font-medium">{{ schematic.author.name }}</p>
            </div>
          </div>

          <div class="h-10 w-px bg-dark-border"></div>

          <!-- Статистика -->
          <div class="flex items-center gap-4 text-sm text-gray-400">
            <span class="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Icon name="heroicons:eye" class="w-4 h-4" />
              {{ formatNumber(schematic.views) }}
            </span>
            <span class="flex items-center gap-1.5 hover:text-red-400 transition-colors">
              <Icon name="heroicons:heart" class="w-4 h-4" />
              {{ formatNumber(schematic.likes) }}
            </span>
            <span class="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
              <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
              {{ formatNumber(schematic.downloads) }}
            </span>
          </div>
        </div>

        <!-- Дата -->
        <div class="text-xs text-gray-500 flex items-center gap-1">
          <Icon name="heroicons:clock" class="w-3.5 h-3.5" />
          {{ formatDate(schematic.updatedAt) }}
        </div>
      </div>
    </div>

    <!-- Иконка перехода -->
    <div class="flex-shrink-0 flex items-center">
      <div class="p-2 rounded-lg bg-primary/0 group-hover:bg-primary/10 transition-colors">
        <Icon name="heroicons:chevron-right" class="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Schematic } from '~/types'
import defaultAvatar from '~/assets/pic/default-avatar.png'
interface Props {
  schematic: Schematic
}

defineProps<Props>()

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Сегодня'
  if (days === 1) return 'Вчера'
  if (days < 7) return `${days}д назад`
  if (days < 30) return `${Math.floor(days / 7)}н назад`
  if (days < 365) return `${Math.floor(days / 30)}мес назад`
  return `${Math.floor(days / 365)}г назад`
}
</script>
