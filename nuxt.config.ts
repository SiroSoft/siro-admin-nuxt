export default defineNuxtConfig({
  srcDir: "src/",

  css: ["~/assets/css/main.css"],

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@nuxt/eslint",
  ],

  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
  },

  tailwindcss: {
    configPath: "~/tailwind.config.ts",
    cssPath: "~/assets/css/main.css",
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || "http://localhost:8080",
      appName: process.env.NUXT_PUBLIC_APP_NAME || "Siro Admin",
    },
  },

  app: {
    head: {
      title: "Siro Admin",
      meta: [
        { name: "description", content: "Siro Admin Nuxt - Modern admin panel for SiroPHP APIs" },
      ],
    },
  },

  nitro: {
    render: {
      publicAssets: { dir: 'public' },
    },
  },

  routeRules: {
    '/**': {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-XSS-Protection': '0',
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' http://localhost:* https:;",
      },
    },
  },

  compatibilityDate: "2026-05-28",
});
