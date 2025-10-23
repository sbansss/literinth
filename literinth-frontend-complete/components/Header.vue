<template>
  <header class="bg-dark-card border-b border-dark-border sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Лого -->
        <NuxtLink to="/" class="text-2xl font-bold text-white hover:text-primary transition-colors font-display">
          LiteRinth
        </NuxtLink>

        <!-- Навигация -->
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink 
            to="/schematics" 
            class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <Icon name="heroicons:wrench-screwdriver" class="w-5 h-5" />
            <span>Схематики</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/news" 
            class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <Icon name="heroicons:newspaper" class="w-5 h-5" />
            <span>Новости по Майнкрафту</span>
          </NuxtLink>
          
          <a 
            href="#" 
            class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            target="_blank"
          >
            <Icon name="heroicons:chat-bubble-left-right" class="w-5 h-5" />
            <span>Наш discord</span>
          </a>
        </nav>

        <!-- Кнопка входа -->
          <NuxtLink to="/login">
        <button class="btn-primary">
          
          Войти
         
        </button>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>
