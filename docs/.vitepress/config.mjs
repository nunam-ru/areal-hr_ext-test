import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "HR-manager",
  description: "Учет сотрудников в организациях",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Быстрый старт', link: '/getting-started' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Быстрый старт', link: '/getting-started' },
          { text: 'Документация', link: '/docs' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/nunam-ru' }
    ]
  }
})
