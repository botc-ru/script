import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

import { syncPngInflate } from './vite-plugins/syncPngInflate.ts'

export default defineConfig({
  base: '/script/',
  // Код PDF работает в потоке: горячая перезагрузка React обращается к window, а его там нет
  plugins: [react({ exclude: [/\/src\/pdf\//, /\/node_modules\//] })],
  // Поток PDF — модуль: react-pdf внутри него подгружает части кода динамически
  worker: {
    format: 'es',
    plugins: () => [syncPngInflate()],
  },
  optimizeDeps: {
    rolldownOptions: { plugins: [syncPngInflate()] },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
