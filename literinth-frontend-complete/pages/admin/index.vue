<template>
  <div class="min-h-screen bg-dark-bg">
    <div class="container mx-auto px-4 py-8">
      <!-- Заголовок -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-white">{{ t.adminPanel }}</h1>
        <NuxtLink
          to="/"
          class="px-4 py-2 bg-dark-card hover:bg-dark-hover rounded-lg text-white transition-colors"
        >
          ← {{ t.home }}
        </NuxtLink>
      </div>

      <!-- Навигация -->
      <div class="flex gap-2 mb-8 overflow-x-auto">
        <NuxtLink
          to="/admin"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
            $route.path === '/admin'
              ? 'bg-primary text-white'
              : 'bg-dark-card text-gray-400 hover:text-white',
          ]"
        >
          {{ t.statistics }}
        </NuxtLink>
        <NuxtLink
          to="/admin/categories"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
            $route.path.startsWith('/admin/categories')
              ? 'bg-primary text-white'
              : 'bg-dark-card text-gray-400 hover:text-white',
          ]"
        >
          {{ t.categories }}
        </NuxtLink>
        <NuxtLink
          to="/admin/schematics"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
            $route.path.startsWith('/admin/schematics')
              ? 'bg-primary text-white'
              : 'bg-dark-card text-gray-400 hover:text-white',
          ]"
        >
          {{ t.schematics }}
        </NuxtLink>
      </div>

      <!-- Статистика -->
      <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-dark-card rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-500/10 rounded-lg">
              <Icon name="mdi:account-group" class="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <p class="text-gray-400 text-sm">{{ t.totalUsers }}</p>
              <p class="text-3xl font-bold text-white">{{ stats.users }}</p>
            </div>
          </div>
        </div>

        <div class="bg-dark-card rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-green-500/10 rounded-lg">
              <Icon name="mdi:cube-outline" class="w-8 h-8 text-green-500" />
            </div>
            <div>
              <p class="text-gray-400 text-sm">{{ t.totalSchematics }}</p>
              <p class="text-3xl font-bold text-white">
                {{ stats.schematics.total }}
              </p>
              <div class="flex gap-4 mt-2 text-sm">
                <span class="text-gray-400">
                  RU: <span class="text-green-400">{{ stats.schematics.visibleRu }}</span>
                </span>
                <span class="text-gray-400">
                  EN: <span class="text-blue-400">{{ stats.schematics.visibleEn }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-dark-card rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-purple-500/10 rounded-lg">
              <Icon name="mdi:folder-outline" class="w-8 h-8 text-purple-500" />
            </div>
            <div>
              <p class="text-gray-400 text-sm">{{ t.totalCategories }}</p>
              <p class="text-3xl font-bold text-white">
                {{ stats.categories }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Информация -->
      <div class="bg-dark-card rounded-xl p-6">
        <h2 class="text-xl font-bold text-white mb-4">
          {{ t.contentManagement }}
        </h2>
        <div class="space-y-3 text-gray-400">
          <p>
            Используйте вкладки выше для управления категориями и схематиками.
          </p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Управляйте видимостью контента для русской и английской версий</li>
            <li>Редактируйте переводы категорий и схематиков</li>
            <li>Просматривайте статистику в реальном времени</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});

const { t } = useLocale();
const api = useApi();

const loading = ref(true);
const stats = ref({
  users: 0,
  schematics: {
    total: 0,
    published: 0,
    visibleRu: 0,
    visibleEn: 0,
  },
  categories: 0,
});

onMounted(async () => {
  try {
    const response = await api.adminGetStats();
    stats.value = response;
  } catch (error) {
    console.error("Error loading stats:", error);
  } finally {
    loading.value = false;
  }
});
</script>
