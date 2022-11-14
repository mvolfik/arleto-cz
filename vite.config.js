import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  build: {
    assetsInlineLimit: 0,
  },
  server: {
    fs: {
      allow: ["content/"],
    },
  },
};

if (process.env.EVO_DEBUG_BUILD === "y") {
  config.build.minify = false;
}

export default config;
