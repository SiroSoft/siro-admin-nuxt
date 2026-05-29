export default defineNuxtConfig({
  srcDir: "src/",

  css: ["~/assets/css/main.css"],

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
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

  compatibilityDate: "2026-05-28",
});
