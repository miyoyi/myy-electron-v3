import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import svgLoader from "vite-svg-loader";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

// ? <script setup lang="ts" name="xxx">
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import { electronStart } from "./plugin/vite-plugin-electron/index";

export default defineConfig({
  base: "./", // * 打包相对路径,否则electron加载index.html时找不到css,js文件
  plugins: [
    vue(),
    vueJsx(),
    svgLoader({ svgoConfig: {} }),
    VueSetupExtend(),
    electronStart({
      target: "win"
    }),
    // 自动按需导入组件库,自动导入components/*下组件
    Components({
      dts: "types/components.d.ts"
    }),
    // 自动引入
    AutoImport({
      imports: ["vue", "vue-router", "pinia", "@vueuse/core"],
      dts: "types/auto-import.d.ts"
    })
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "../src")
      },
      {
        find: "~s",
        replacement: resolve(__dirname, "../src/store")
      },
      {
        find: "~h",
        replacement: resolve(__dirname, "../src/hooks")
      },
      {
        find: "assets",
        replacement: resolve(__dirname, "../src/assets")
      },
      {
        find: "vue-i18n",
        replacement: "vue-i18n/dist/vue-i18n.cjs.js" // Resolve the i18n warning issue
      },
      {
        find: "vue",
        replacement: "vue/dist/vue.esm-bundler.js" // compile template
      }
    ],
    extensions: [".ts", ".js"]
  },
  build: {
    outDir: "output/vite" // 打包输出文件路径
  },
  define: {
    "process.env": {}
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve("src/assets/style/breakpoint.less")}";`
        },
        javascriptEnabled: true
      }
    }
  }
});
