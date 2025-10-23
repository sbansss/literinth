<template>
  <div class="card overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer">
    <!-- Изображение -->
    <div class="aspect-video bg-gray-700 relative">
      <img
        v-if="schematic.imageUrl"
        :src="schematic.imageUrl"
        :alt="schematic.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800" />
    </div>

    <!-- Контент -->
    <div class="p-4">
      <!-- Заголовок и автор -->
      <div class="mb-3">
        <h3 class="text-white font-bold text-lg mb-1 font-display">
          {{ schematic.title }}
        </h3>
        <p class="text-gray-400 text-sm">
          Сделал: {{ schematic.author?.name }}
        </p>
      </div>

      <!-- Описание -->
      <p class="text-gray-300 text-sm mb-4">
        {{ schematic.description }}
      </p>

      <!-- Теги -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in schematic.tags"
          :key="tag"
          class="text-xs px-2 py-1 bg-dark-bg rounded text-gray-300"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Статистика -->
      <div class="flex items-center justify-between text-sm text-gray-400 border-t border-dark-border pt-3 font-mono">
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1">
            <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
            {{ formatNumber(schematic.downloads) }}
          </span>
          <span class="flex items-center gap-1">
            <Icon name="heroicons:heart" class="w-4 h-4" />
            {{ formatNumber(schematic.likes) }}
          </span>
        </div>
        <span class="text-xs flex items-center gap-1">
          <Icon name="heroicons:arrow-path" class="w-3 h-3" />
          Обновлено {{ schematic.updatedAt }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schematic } from '~/types'

interface Props {
  schematic: Schematic
}

defineProps<Props>()

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}
</script>
