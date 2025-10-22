<template>
  <div class="bg-dark-bg border-b border-dark-border">
    <div class="container mx-auto px-4">
      <div class="flex gap-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="$emit('change', tab.id)"
          :class="[
            'py-4 px-2 text-lg font-medium transition-colors border-b-2',
            activeTab === tab.id
              ? 'text-white border-primary'
              : 'text-gray-400 border-transparent hover:text-gray-200'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabType } from '~/types'

interface Tab {
  id: TabType
  label: string
}

defineProps<{
  activeTab: TabType
}>()

defineEmits<{
  change: [tab: TabType]
}>()

const tabs: Tab[] = [
  { id: 'redstone', label: 'Редстоун' },
  { id: 'builds', label: 'Постройки' },
  { id: 'worlds', label: 'Миры' }
]
</script>
