import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        //Allows me to deploy multi page apps https://vite.dev/guide/build.html#multi-page-app
        main: resolve(__dirname, 'index.html'),
        blogs: resolve(__dirname, 'Blogs.html'),
        exception_reasoning: resolve(__dirname, 'Blogs/How_to_reason_about_exceptions.html'),
      },
    },
  },

  //Using aliases, allows me to define a new base path for the deployed site to search for without having to do a bunch of `../../` to get my relative path
  //Helped solved by using https://stackoverflow.com/questions/75798479/how-can-i-solve-the-issue-of-failed-to-resolve-import-in-vitest
  resolve: {
    alias: [{ find: "@common", replacement: resolve(__dirname, "./Common") }]
  }
})
