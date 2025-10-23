<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-sm border min-w-[320px] max-w-md',
            toastStyles[toast.type]
          ]"
        >
          <!-- Иконка -->
          <div class="flex-shrink-0 mt-0.5">
            <Icon 
              :name="toastIcons[toast.type]" 
              class="w-5 h-5"
            />
          </div>

          <!-- Текст -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white">{{ toast.message }}</p>
          </div>

          <!-- Кнопка закрытия -->
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Icon name="heroicons:x-mark" class="w-4 h-4 text-white/80 hover:text-white" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast()

const toastStyles = {
  success: 'bg-green-600/90 border-green-500/50',
  error: 'bg-red-600/90 border-red-500/50',
  warning: 'bg-yellow-600/90 border-yellow-500/50',
  info: 'bg-blue-600/90 border-blue-500/50'
}

const toastIcons = {
  success: 'heroicons:check-circle',
  error: 'heroicons:x-circle',
  warning: 'heroicons:exclamation-triangle',
  info: 'heroicons:information-circle'
}

const removeToast = (id: string) => {
  remove(id)
}
</script>
