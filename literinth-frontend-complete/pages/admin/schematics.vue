<template>
  <div class="min-h-screen bg-dark-bg">
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-white">{{ t.schematics }}</h1>
        <NuxtLink
          to="/admin"
          class="px-4 py-2 bg-dark-card hover:bg-dark-hover rounded-lg text-white"
        >
          ← {{ t.adminPanel }}
        </NuxtLink>
      </div>

      <!-- Поиск -->
      <div class="mb-6">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t.searchPlaceholder"
          class="w-full bg-dark-card border border-gray-700 rounded-lg px-4 py-3 text-white"
          @input="debouncedSearch"
        />
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-400">{{ t.loading }}</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="schematic in schematics"
          :key="schematic.id"
          class="bg-dark-card rounded-xl p-6"
        >
          <div class="flex gap-4">
            <!-- Превью -->
            <div class="flex-shrink-0">
              <img
                :src="schematic.imageUrl || '/placeholder.png'"
                :alt="schematic.translations.ru?.title"
                class="w-32 h-32 object-cover rounded-lg"
              />
            </div>

            <!-- Основная информация -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h2 class="text-xl font-bold text-white">
                    {{ schematic.translations.ru?.title || schematic.slug }}
                  </h2>
                  <p class="text-sm text-gray-400">
                    {{ schematic.author.username }} • {{ schematic.category.name }}
                  </p>
                </div>
                <button
                  @click="toggleSchematic(schematic.id)"
                  class="text-primary hover:text-primary-light"
                >
                  <Icon
                    :name="
                      expandedSchematics.includes(schematic.id)
                        ? 'mdi:chevron-up'
                        : 'mdi:chevron-down'
                    "
                    class="w-6 h-6"
                  />
                </button>
              </div>

              <!-- Статистика -->
              <div class="flex gap-4 text-sm text-gray-400 mb-3">
                <span>👁️ {{ schematic.views }}</span>
                <span>⬇️ {{ schematic.downloads }}</span>
                <span>❤️ {{ schematic.likes }}</span>
              </div>

              <!-- Видимость -->
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="schematic.published"
                    @change="
                      updateSchematicVisibility(schematic.id, {
                        published: !schematic.published,
                      })
                    "
                    class="w-4 h-4 rounded"
                  />
                  <span class="text-sm text-gray-400">{{ t.published }}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="schematic.visibleRu"
                    @change="
                      updateSchematicVisibility(schematic.id, {
                        visibleRu: !schematic.visibleRu,
                      })
                    "
                    class="w-4 h-4 rounded"
                  />
                  <span class="text-sm text-gray-400">🇷🇺 RU</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="schematic.visibleEn"
                    @change="
                      updateSchematicVisibility(schematic.id, {
                        visibleEn: !schematic.visibleEn,
                      })
                    "
                    class="w-4 h-4 rounded"
                  />
                  <span class="text-sm text-gray-400">🇬🇧 EN</span>
                </label>
              </div>

              <!-- Развернутая информация -->
              <div
                v-if="expandedSchematics.includes(schematic.id)"
                class="border-t border-gray-700 mt-4 pt-4"
              >
                <h3 class="text-sm font-semibold text-gray-400 mb-3">
                  {{ t.translations }}
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Русская версия -->
                  <div class="bg-dark-bg rounded-lg p-4">
                    <p class="text-xs text-gray-500 mb-2">🇷🇺 {{ t.russian }}</p>
                    <input
                      v-model="schematic.translations.ru.title"
                      type="text"
                      class="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-white mb-2"
                      placeholder="Название"
                    />
                    <textarea
                      v-model="schematic.translations.ru.description"
                      class="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-white mb-2"
                      placeholder="Описание"
                      rows="3"
                    ></textarea>
                    <textarea
                      v-model="schematic.translations.ru.content"
                      class="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-white"
                      placeholder="Полное описание"
                      rows="5"
                    ></textarea>
                  </div>

                  <!-- Английская версия -->
                  <div class="bg-dark-bg rounded-lg p-4">
                    <p class="text-xs text-gray-500 mb-2">🇬🇧 {{ t.english }}</p>
                    <input
                      v-model="schematic.translations.en.title"
                      type="text"
                      class="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-white mb-2"
                      placeholder="Title"
                    />
                    <textarea
                      v-model="schematic.translations.en.description"
                      class="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-white mb-2"
                      placeholder="Description"
                      rows="3"
                    ></textarea>
                    <textarea
                      v-model="schematic.translations.en.content"
                      class="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-white"
                      placeholder="Full description"
                      rows="5"
                    ></textarea>
                  </div>
                </div>
                <button
                  @click="saveSchematicTranslations(schematic)"
                  class="mt-3 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-white"
                >
                  {{ t.save }} {{ t.translations }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Пагинация -->
        <div v-if="pagination.totalPages > 1" class="flex justify-center gap-2 mt-8">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="loadSchematics(page)"
            :class="[
              'px-4 py-2 rounded-lg',
              page === pagination.page
                ? 'bg-primary text-white'
                : 'bg-dark-card text-gray-400 hover:text-white',
            ]"
          >
            {{ page }}
          </button>
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
const searchQuery = ref("");
const schematics = ref<any[]>([]);
const expandedSchematics = ref<string[]>([]);
const pagination = ref({
  page: 1,
  perPage: 20,
  total: 0,
  totalPages: 0,
});

let searchTimeout: NodeJS.Timeout;

const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadSchematics(1);
  }, 500);
};

const loadSchematics = async (page = 1) => {
  loading.value = true;
  try {
    const response = await api.adminGetSchematics({
      page,
      perPage: 20,
      search: searchQuery.value || undefined,
    });
    schematics.value = response.data;
    pagination.value = response.pagination;
  } catch (error) {
    console.error("Error loading schematics:", error);
  } finally {
    loading.value = false;
  }
};

const toggleSchematic = (id: string) => {
  const index = expandedSchematics.value.indexOf(id);
  if (index > -1) {
    expandedSchematics.value.splice(index, 1);
  } else {
    expandedSchematics.value.push(id);
  }
};

const updateSchematicVisibility = async (
  id: string,
  data: { visibleRu?: boolean; visibleEn?: boolean; published?: boolean }
) => {
  try {
    await api.adminUpdateSchematicVisibility(id, data);
    await loadSchematics(pagination.value.page);
  } catch (error) {
    console.error("Error updating visibility:", error);
  }
};

const saveSchematicTranslations = async (schematic: any) => {
  try {
    await api.adminUpdateSchematicTranslations(schematic.id, [
      {
        locale: "RU",
        title: schematic.translations.ru.title,
        description: schematic.translations.ru.description,
        content: schematic.translations.ru.content,
      },
      {
        locale: "EN",
        title: schematic.translations.en.title,
        description: schematic.translations.en.description,
        content: schematic.translations.en.content,
      },
    ]);
    alert("Переводы сохранены!");
  } catch (error) {
    console.error("Error saving translations:", error);
  }
};

const visiblePages = computed(() => {
  const current = pagination.value.page;
  const total = pagination.value.totalPages;
  const pages: number[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (current > 3) pages.push(-1); // Разделитель
    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(total - 1, current + 1);
      i++
    ) {
      pages.push(i);
    }
    if (current < total - 2) pages.push(-1); // Разделитель
    pages.push(total);
  }

  return pages;
});

onMounted(() => {
  loadSchematics();
});
</script>
