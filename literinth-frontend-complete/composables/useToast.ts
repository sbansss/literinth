interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration: number
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const show = (message: string, type: Toast['type'] = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    
    toasts.value.push({
      id,
      type,
      message,
      duration
    })

    setTimeout(() => {
      remove(id)
    }, duration)
  }

  const remove = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const success = (message: string, duration?: number) => show(message, 'success', duration)
  const error = (message: string, duration?: number) => show(message, 'error', duration)
  const info = (message: string, duration?: number) => show(message, 'info', duration)
  const warning = (message: string, duration?: number) => show(message, 'warning', duration)

  return {
    toasts: readonly(toasts),
    show,
    remove,
    success,
    error,
    info,
    warning
  }
}
