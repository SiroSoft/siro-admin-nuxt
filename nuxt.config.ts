export default defineNuxtConfig({
  ssr: false,
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
      feToken: process.env.NUXT_PUBLIC_FE_TOKEN || "",
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || "",
    },
  },

  app: {
    head: {
      title: "Siro Admin",
      meta: [
        { name: "description", content: "Siro Admin Nuxt - Modern admin panel for SiroPHP APIs" },
        { property: "og:title", content: "Siro Admin - SiroPHP Demo" },
        { property: "og:description", content: "Try the live demo, then grab the open-source admin template and SiroPHP skeleton." },
        { property: "og:url", content: "https://admin-nuxt.sirophp.com" },
        { property: "og:site_name", content: "Siro Admin" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
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
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; frame-src 'self' https://challenges.cloudflare.com; connect-src 'self' http://localhost:* https:;",
      },
    },
  },

  build: {
    transpile: ["debug"],
  },

  vite: {
    ssr: {
      noExternal: ["debug"],
    },
  },

  compatibilityDate: "2026-05-28",
});
