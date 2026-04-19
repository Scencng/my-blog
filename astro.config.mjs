import { defineConfig } from "astro/config";

import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import swup from "@swup/astro";

import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkMath from "remark-math";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

import YukinaConfig from "./yukina.config";

import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
  site: YukinaConfig.site,
  integrations: [
    tailwind(),
    svelte(),
    icon(),
    swup({
      theme: false,
      // Footer lives inside `<main>`; listing both made Swup replace nested containers twice.
      containers: ["main", ".banner-inner"],
      smoothScrolling: true,
      progress: true,
      cache: true,
      preload: true,
      // Avoid stripping/reordering Vite/Astro-injected stylesheets on client navigations.
      updateHead: false,
      updateBodyClass: false,
      globalInstance: true,
      // Prevents layout scripts from re-running each visit (duplicate listeners / OSB wraps).
      reloadScripts: false,
    }),
    sitemap(),
    pagefind(),
  ],
  vite: {
    optimizeDeps: {
      exclude: ['@swup/astro'],
    },
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
    },
    remarkPlugins: [remarkReadingTime, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      rehypeKatex,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "prepend",
        },
      ],
    ],
  },
});
