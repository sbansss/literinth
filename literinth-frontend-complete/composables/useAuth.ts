import type { User } from '~/types'

export const useAuth = () => {
  const user = useState<User | null>('user', () => null)
  const loading = useState<boolean>('auth-loading', () => false)
  const api = useApi()

  const loadUser = async () => {
    if (loading.value) return
    
    loading.value = true
    try {
      const currentUser = await api.getCurrentUser()
      user.value = currentUser
    } catch (error) {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const loginUser = async (email: string, password: string) => {
    loading.value = true
    try {
      const result = await api.login({ email, password })
      user.value = result.data
      return result
    } finally {
      loading.value = false
    }
  }

  const registerUser = async (data: {
    email: string
    username: string
    password: string
    name?: string
  }) => {
    loading.value = true
    try {
      const result = await api.register(data)
      user.value = result.data
      return result
    } finally {
      loading.value = false
    }
  }

  const logoutUser = async () => {
    loading.value = true
    try {
      await api.logout()
      user.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    loadUser,
    loginUser,
    registerUser,
    logoutUser,
    isAuthenticated: computed(() => !!user.value),
  }
}
