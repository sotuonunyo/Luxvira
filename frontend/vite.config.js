import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Ensure proper base path for Render
    rollupOptions: {
      output: {
        manualChunks: undefined // Prevent chunking issues on free tier
      }
    }
  },
  // Fix for client-side routing on Render
  server: {
    historyApiFallback: true
  }
})
