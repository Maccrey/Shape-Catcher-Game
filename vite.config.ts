import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Enable minification
    minify: 'terser',

    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    },

    // Disable source maps in production
    sourcemap: false,

    // Chunk size warning limit
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'state-vendor': ['zustand'],
          'animation-vendor': ['framer-motion', 'gsap'],

          // Game core
          'game-core': [
            './src/core/GameLoop',
            './src/core/GameEngine',
            './src/core/PhysicsEngine',
            './src/core/CollisionDetector',
          ],

          // Game managers
          'game-managers': [
            './src/game/LevelManager',
            './src/game/ShapeManager',
            './src/game/PowerUpManager',
            './src/game/AchievementManager',
          ],
        },

        // Clean file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
      },
    },

    // Inline small assets as base64 (4KB threshold)
    assetsInlineLimit: 4096,
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand', 'framer-motion'],
  },
})