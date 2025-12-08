import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isSingleFile = process.env.SINGLEFILE === 'true'
  
  return {
    plugins: [
      react(),
      ...(isSingleFile ? [viteSingleFile()] : [])
    ],
    base: process.env.VITE_BASE || '/',
    server: {
      port: 3000,
      open: true
    },
    build: {
      ...(isSingleFile ? {
        // Optimize for single file output
        cssCodeSplit: false,
        rollupOptions: {
          output: {
            inlineDynamicImports: true,
          }
        }
      } : {})
    }
  }
})

