import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Optimized Vite configuration for production builds
 *
 * This configuration includes:
 * - Code splitting for better caching
 * - Minification and tree-shaking
 * - Compression
 * - Asset optimization
 */
export default defineConfig({
  plugins: [react()],

  build: {
    // Output directory
    outDir: 'dist',

    // Enable minification
    minify: 'terser',

    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'], // Remove specific functions
      },
    },

    // Enable source maps for debugging (disable in production for smaller size)
    sourcemap: false,

    // Chunk size warnings
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // Manual chunk splitting
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'animation-vendor': ['framer-motion'],

          // Game logic chunks
          'game-core': [
            './src/core/GameLoop.ts',
            './src/core/GameEngine.ts',
            './src/core/PhysicsEngine.ts',
            './src/core/CollisionDetector.ts',
          ],

          'game-managers': [
            './src/game/LevelManager.ts',
            './src/game/ShapeManager.ts',
            './src/game/PowerUpManager.ts',
            './src/game/AchievementManager.ts',
          ],

          // UI chunks
          'ui-components': [
            './src/components/UI/StatusBar.tsx',
            './src/components/UI/ProgressBar.tsx',
            './src/components/UI/ComboDisplay.tsx',
          ],

          'menu-components': [
            './src/components/Menu/MainMenu.tsx',
            './src/components/Menu/GameOverScreen.tsx',
            './src/components/Menu/PauseMenu.tsx',
            './src/components/Menu/Settings.tsx',
          ],
        },

        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.');
          let extType = info?.[info.length - 1];

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || '')) {
            extType = 'images';
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType || '')) {
            extType = 'fonts';
          } else if (/mp3|wav|ogg|m4a/i.test(extType || '')) {
            extType = 'audio';
          }

          return `assets/${extType}/[name]-[hash][extname]`;
        },

        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    // Asset handling
    assetsInlineLimit: 4096, // 4kb - inline smaller assets as base64
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
    exclude: [], // Exclude large dependencies that should be loaded on-demand
  },

  // Performance hints
  server: {
    warmup: {
      clientFiles: [
        './src/App.tsx',
        './src/components/Game/Canvas.tsx',
        './src/core/GameEngine.ts',
      ],
    },
  },
});
