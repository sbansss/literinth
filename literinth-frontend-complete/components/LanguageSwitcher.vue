<template>
  <div class="flex items-center gap-2 bg-dark-card rounded-lg p-1">
    <button
      @click="setLocale('ru')"
      :class="[
        'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
        locale === 'ru'
          ? 'bg-primary text-white'
          : 'text-gray-400 hover:text-white',
      ]"
    >
      RU
    </button>
    <button
      @click="setLocale('en')"
      :class="[
        'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
        locale === 'en'
          ? 'bg-primary text-white'
          : 'text-gray-400 hover:text-white',
      ]"
    >
      EN
    </button>
  </div>
</template>

<script setup lang="ts">
import useLocale from '~/composables/useLocale'
const { locale, setLocale } = useLocale();
</script>