import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    monacoEditorPlugin({})
  ],
  build: {
    outDir: 'dist'
  }
})