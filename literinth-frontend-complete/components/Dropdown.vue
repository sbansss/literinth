<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggle"
      class="btn-secondary text-sm flex items-center gap-2"
      :class="buttonClass"
    >
      <slot name="trigger" :selected="selectedLabel">
        {{ selectedLabel }}
      </slot>
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute top-full mt-2 min-w-[200px] bg-dark-card border border-dark-border rounded-lg shadow-xl z-50"
        :class="alignClass"
      >
        <ul class="py-1">
          <li
            v-for="option in options"
            :key="option.value"
            @click="select(option)"
            :class="[
              'px-4 py-2 cursor-pointer transition-colors',
              selectedValue === option.value
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:bg-dark-hover'
            ]"
          >
            {{ option.label }}
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
