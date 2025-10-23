// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  
  css: ['~/assets/css/main.css'],
  
  typescript: {
    strict: true,
    typeCheck: false // отключено для более быстрого запуска, включите при необходимости
  },

  app: {
    head: {
      title: 'LiteRinth - Схематики и механизмы Minecraft',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Схематики и механизмы для Minecraft' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700;800&family=Unbounded:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
        }
      ]
    }
  }
})
