<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggle"
      class="group relative px-4 py-2.5 bg-gradient-to-br from-dark-card to-dark-card/80 
             border border-dark-border hover:border-primary/50 rounded-xl
             text-sm font-medium text-gray-200 
             flex items-center gap-3 min-w-[180px]
             transition-all duration-300 ease-out
             hover:shadow-lg hover:shadow-primary/10
             active:scale-[0.98]"
      :class="[buttonClass, { 'border-primary shadow-lg shadow-primary/20': isOpen }]"
    >
      <span class="flex-1 text-left">
        <slot name="trigger" :selected="selectedLabel">
          {{ selectedLabel }}
        </slot>
      </span>
      <svg
        class="w-4 h-4 transition-all duration-300 text-gray-400 group-hover:text-primary"
        :class="{ 'rotate-180 text-primary': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
      
      <!-- Светящийся эффект при hover -->
      <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 to-primary/0 
                  group-hover:from-primary/5 group-hover:to-transparent 
                  transition-all duration-300 pointer-events-none" />
    </button>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95 -translate-y-2"
      enter-to-class="transform opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100 translate-y-0"
      leave-to-class="transform opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute top-full mt-2 min-w-full bg-gradient-to-br from-dark-card to-dark-card/95
               border border-dark-border/80 rounded-xl 
               shadow-2xl shadow-black/40 backdrop-blur-sm z-50
               overflow-hidden"
        :class="alignClass"
      >
        <!-- Декоративная линия сверху -->
        <div class="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <ul class="py-2 max-h-[280px] overflow-y-auto custom-scrollbar">
          <li
            v-for="(option, index) in options"
            :key="option.value"
            @click="select(option)"
            :style="{ animationDelay: `${index * 30}ms` }"
            :class="[
              'px-4 py-2.5 cursor-pointer transition-all duration-200',
              'flex items-center gap-3 group/item relative',
              'animate-slide-in-left',
              selectedValue === option.value
                ? 'bg-gradient-to-r from-primary to-primary/80 text-white font-medium shadow-lg shadow-primary/20'
                : 'text-gray-300 hover:bg-dark-hover/60 hover:text-white hover:pl-5'
            ]"
          >
            <!-- Индикатор выбранного элемента -->
            <div 
              v-if="selectedValue === option.value"
              class="absolute left-0 w-1 h-full bg-white/30 rounded-r-full" 
            />
            
            <!-- Иконка чекмарка -->
            <svg 
              v-if="selectedValue === option.value"
              class="w-4 h-4 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            
            <span class="flex-1">{{ option.label }}</span>
            
            <!-- Hover стрелка -->
            <svg 
              v-if="selectedValue !== option.value"
              class="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 text-primary" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface DropdownOption {
  value: string | number
  label: string
}

interface Props {
  options: DropdownOption[]
  modelValue: string | number
  align?: 'left' | 'right'
  buttonClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  align: 'left'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const dropdownRef = ref<HTMLElement>()
const isOpen = ref(false)
const selectedValue = toRef(props, 'modelValue')

const selectedLabel = computed(() => {
  const option = props.options.find(opt => opt.value === selectedValue.value)
  return option?.label || ''
})

const alignClass = computed(() => {
  return props.align === 'right' ? 'right-0' : 'left-0'
})

const toggle = () => {
  isOpen.value = !isOpen.value
}

const select = (option: DropdownOption) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

// Закрытие при клике вне компонента
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-left {
  animation: slide-in-left 0.3s ease-out forwards;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.3);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.5);
}
</style>