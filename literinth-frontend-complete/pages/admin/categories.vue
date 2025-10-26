<template>
  <div class="min-h-screen bg-dark-bg">
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-white">{{ t.categories }}</h1>
        <NuxtLink
          to="/admin"
          class="px-4 py-2 bg-dark-card hover:bg-dark-hover rounded-lg text-white"
        >
          ← {{ t.adminPanel }}
        </NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-400">{{ t.loading }}</p>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="category in categories"
          :key="category.id"
          class="bg-dark-card rounded-xl p-6"
        >
          <!-- Заголовок категории -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ category.icon || "📁" }}</span>
              <div>
                <h2 class="text-xl font-bold text-white">
                  {{ category.translations.ru?.name || category.slug }}
                </h2>
                <p class="text-sm text-gray-400">
                  {{ category.schematicsCount }} схематиков
                </p>
              </div>
            </div>
            <button
              @click="toggleCategory(category.id)"
              class="text-primary hover:text-primary-light"
            >
              <Icon
                :name="
                  expandedCategories.includes(category.id)
                    ? 'mdi:chevron-up'
                    : 'mdi:chevron-down'
                "
                class="w-6 h-6"
              />
            </button>
          </div>

          <!-- Видимость -->
          <div class="flex gap-4 mb-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="category.visibleRu"
                @change="
                  updateCategoryVisibility(category.id, {
                    visibleRu: !category.visibleRu,
                  })
                "
                class="w-4 h-4 rounded bg-dark-bg border-gray-600"
              />
              <span class="text-sm text-gray-400">🇷🇺 {{ t.visibleInRussian }}</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="category.visibleEn"
                @change="
                  updateCategoryVisibility(category.id, {
                    visibleEn: !category.visibleEn,
                  })
                "
                class="w-4 h-4 rounded bg-dark-bg border-gray-600"
              />
              <span class="text-sm text-gray-400">🇬🇧 {{ t.visibleInEnglish }}</span>
            </label>
          </div>

          <!-- Раскрытые детали -->
          <div
            v-if="expandedCategories.includes(category.id)"
            class="border-t border-gray-700 pt-4 space-y-4"
          >
            <!-- Переводы -->
            <div>
              <h3 class="text-sm font-semibold text-gray-400 mb-2">
                {{ t.translations }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-dark-bg rounded-lg p-4">
                  <p class="text-xs text-gray-500 mb-2">🇷🇺 {{ t.russian }}</p>
                  <input
                    v-model="category.translations.ru.name"
                    type="text"
                    class="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-white mb-2"
                    placeholder="Название"
                  />
                  <textarea
                    v-model="category.translations.ru.description"
                    class="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-white"
                    placeholder="Описание"
                    rows="2"
                  ></textarea>
                </div>
                <div class="bg-dark-bg rounded-lg p-4">
                  <p class="text-xs text-gray-500 mb-2">🇬🇧 {{ t.english }}</p>
                  <input
                    v-model="category.translations.en.name"
                    type="text"
                    class="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-white mb-2"
                    placeholder="Name"
                  />
                  <textarea
                    v-model="category.translations.en.description"
                    class="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-white"
                    placeholder="Description"
                    rows="2"
                  ></textarea>
                </div>
              </div>
              <button
                @click="saveCategoryTranslations(category)"
                class="mt-2 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-white"
              >
                {{ t.save }} {{ t.translations }}
              </button>
            </div>

            <!-- Подкатегории -->
            <div v-if="category.subcategories.length > 0">
              <h3 class="text-sm font-semibold text-gray-400 mb-2">
                Подкатегории ({{ category.subcategories.length }})
              </h3>
              <div class="space-y-2">
                <div
                  v-for="sub in category.subcategories"
                  :key="sub.id"
                  class="bg-dark-bg rounded-lg p-3"
                >
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-white font-medium">
                      {{ sub.translations.ru?.name || sub.slug }}
                    </p>
                    <div class="flex gap-2">
                      <label class="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          :checked="sub.visibleRu"
                          @change="
                            updateSubcategoryVisibility(sub.id, {
                              visibleRu: !sub.visibleRu,
                            })
                          "
                          class="w-3 h-3"
                        />
                        🇷🇺
                      </label>
                      <label class="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          :checked="sub.visibleEn"
                          @change="
                            updateSubcategoryVisibility(sub.id, {
                              visibleEn: !sub.visibleEn,
                            })
                          "
                          class="w-3 h-3"
                        />
                        🇬🇧
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
const categories = ref<any[]>([]);
const expandedCategories = ref<string[]>([]);

const loadCategories = async () => {
  try {
    const response = await api.adminGetCategories();
    categories.value = response.categories;
  } catch (error) {
    console.error("Error loading categories:", error);
  } finally {
    loading.value = false;
  }
};

const toggleCategory = (id: string) => {
  const index = expandedCategories.value.indexOf(id);
  if (index > -1) {
    expandedCategories.value.splice(index, 1);
  } else {
    expandedCategories.value.push(id);
  }
};

const updateCategoryVisibility = async (
  id: string,
  data: { visibleRu?: boolean; visibleEn?: boolean }
) => {
  try {
    await api.adminUpdateCategoryVisibility(id, data);
    await loadCategories();
  } catch (error) {
    console.error("Error updating visibility:", error);
  }
};

const saveCategoryTranslations = async (category: any) => {
  try {
    await api.adminUpdateCategoryTranslations(category.id, [
      {
        locale: "RU",
        name: category.translations.ru.name,
        description: category.translations.ru.description,
      },
      {
        locale: "EN",
        name: category.translations.en.name,
        description: category.translations.en.description,
      },
    ]);
    alert("Переводы сохранены!");
  } catch (error) {
    console.error("Error saving translations:", error);
  }
};

const updateSubcategoryVisibility = async (
  id: string,
  data: { visibleRu?: boolean; visibleEn?: boolean }
) => {
  try {
    await api.adminUpdateSubcategoryVisibility(id, data);
    await loadCategories();
  } catch (error) {
    console.error("Error updating subcategory visibility:", error);
  }
};

onMounted(() => {
  loadCategories();
});
</script>
