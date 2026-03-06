import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari13'],
    minify: 'terser',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2015'
    }
  }
})
