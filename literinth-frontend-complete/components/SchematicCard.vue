<template>
  <NuxtLink 
    :to="`/schematics/${schematic.id}`"
    class="group bg-dark-card rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
  >
    <!-- Изображение -->
    <div class="aspect-video bg-gradient-to-br from-gray-700 to-gray-900 relative overflow-hidden flex-shrink-0">

      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <!-- Оверлей при ховере -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <Icon name="heroicons:eye" class="w-5 h-5" />
          Смотреть
        </div>
      </div>

      <!-- Категория -->
      <div class="absolute top-3 left-3">
        <span class="px-3 py-1.5 bg-dark-bg/90 backdrop-blur-sm text-primary text-xs font-semibold rounded-full border border-primary/30">
          {{ schematic.category.name }}
        </span>
      </div>
    </div>

    <!-- Контент -->
    <div class="p-5 flex flex-col flex-1 min-h-0">
      <!-- Заголовок -->
      <h3 class="text-white font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
        {{ schematic.title }}
      </h3>

      <!-- Описание -->
      <p class="text-gray-400 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
        {{ schematic.description }}
      </p>

      <!-- Теги -->
      <div class="flex flex-wrap gap-1.5 mb-3 min-h-[1.75rem]">
        <span
          v-for="tag in schematic.tags.slice(0, 3)"
          :key="tag.id"
          class="text-xs px-2 py-1 bg-dark-bg rounded-full text-gray-300 border border-dark-border hover:border-primary/50 transition-colors"
        >
          {{ tag.name }}
        </span>
        <span v-if="schematic.tags.length > 3" class="text-xs px-2 py-1 text-gray-500">
          +{{ schematic.tags.length - 3 }}
        </span>
      </div>

      <!-- Разделитель -->
      <div class="flex-1"></div>

      <!-- Автор -->
      <div class="flex items-center gap-2 mb-3 pb-3 border-b border-dark-border">
        <img 
          :src="schematic.author.image || defaultAvatar" 
          :alt="schematic.author.name"
          class="w-7 h-7 rounded-full ring-2 ring-dark-border group-hover:ring-primary transition-colors flex-shrink-0"
        />
        <div class="flex-1 min-w-0">
          <p class="text-xs text-gray-500">Сделал:</p>
          <p class="text-white text-sm font-medium truncate">{{ schematic.author.name }}</p>
        </div>
      </div>

      <!-- Статистика -->
      <div class="flex items-center justify-between text-sm text-gray-400">
        <span class="flex items-center gap-1 hover:text-primary transition-colors">
          <Icon name="heroicons:eye" class="w-4 h-4 flex-shrink-0" />
          <span class="text-xs">{{ formatNumber(schematic.views) }}</span>
        </span>
        <span class="flex items-center gap-1 hover:text-red-400 transition-colors">
          <Icon name="heroicons:heart" class="w-4 h-4 flex-shrink-0" />
          <span class="text-xs">{{ formatNumber(schematic.likes) }}</span>
        </span>
        <span class="flex items-center gap-1 hover:text-blue-400 transition-colors">
          <Icon name="heroicons:arrow-down-tray" class="w-4 h-4 flex-shrink-0" />
          <span class="text-xs">{{ formatNumber(schematic.downloads) }}</span>
        </span>
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
</script>
