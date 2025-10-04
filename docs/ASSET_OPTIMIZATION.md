# Asset Optimization Guide

This document outlines the asset optimization strategy for the Shape Catcher Game.

## Current Asset Strategy

The game uses a **zero-external-asset architecture** for maximum performance:

### Graphics
- **Canvas 2D Rendering**: All shapes, effects, and UI elements are drawn programmatically
- **No image files required**: Reduces HTTP requests and bundle size
- **Dynamic theming**: Colors and styles applied via code, not static assets

### Audio
- **Web Audio API**: Procedural sound generation using oscillators
- **No audio files**: All sounds generated in real-time
- **Lightweight**: No need for compressed audio files (MP3/OGG)

### Fonts
- **System fonts**: Uses platform-native fonts (no custom font files)
- **Fallback chain**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...`

## Build Optimization

### Code Splitting

The project uses manual chunk splitting for optimal caching:

```typescript
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'animation-vendor': ['framer-motion'],
  'game-core': [...],
  'game-managers': [...],
  'ui-components': [...],
  'menu-components': [...]
}
```

**Benefits**:
- Vendor code cached separately (rarely changes)
- Game logic split by concern
- Parallel download for faster initial load

### Lazy Loading

Menu components are lazy-loaded:

```typescript
const MainMenu = lazy(() => import('./components/Menu/MainMenu'));
const PauseMenu = lazy(() => import('./components/Menu/PauseMenu'));
const GameOver = lazy(() => import('./components/Menu/GameOver'));
```

**Benefits**:
- Smaller initial bundle
- Faster time-to-interactive
- Load on demand when needed

### Minification

Production builds use Terser with aggressive compression:

```typescript
terserOptions: {
  compress: {
    drop_console: true,    // Remove console.log
    drop_debugger: true,   // Remove debugger statements
    pure_funcs: ['console.log', 'console.info']
  }
}
```

### Asset Inlining

Small assets (< 4KB) are inlined as base64:

```typescript
assetsInlineLimit: 4096  // 4KB threshold
```

## Performance Targets

### Bundle Size
- **Target**: < 500KB (gzipped)
- **Current Strategy**: Code splitting + tree shaking
- **Monitoring**: `npm run build` reports chunk sizes

### Initial Load
- **Target**: < 3 seconds on 3G
- **Strategy**:
  - Lazy load non-critical components
  - Inline critical CSS
  - Preload key modules

### Runtime Performance
- **Target**: 60fps on desktop, 30fps on mobile
- **Strategy**:
  - Canvas optimization (dirty rectangles)
  - Object pooling (particles)
  - RequestAnimationFrame throttling

## Future Asset Optimization (If Needed)

### If Adding Images

1. **Format Selection**
   ```bash
   # Convert PNG to WebP (90% quality)
   cwebp -q 90 image.png -o image.webp

   # With fallback for older browsers
   <picture>
     <source srcset="image.webp" type="image/webp">
     <img src="image.png" alt="fallback">
   </picture>
   ```

2. **Responsive Images**
   ```typescript
   // Vite plugin for automatic image optimization
   import { imagetools } from 'vite-imagetools'

   plugins: [imagetools()]
   ```

3. **Lazy Loading Images**
   ```typescript
   <img loading="lazy" src="..." alt="...">
   ```

### If Adding Audio Files

1. **Compression**
   ```bash
   # Convert to MP3 at 128kbps
   ffmpeg -i input.wav -b:a 128k output.mp3

   # Convert to OGG for broader support
   ffmpeg -i input.wav -codec:a libvorbis -qscale:a 5 output.ogg
   ```

2. **Audio Sprites**
   ```typescript
   // Combine multiple sounds into one file
   const audioSprite = new Howl({
     src: ['sounds.mp3'],
     sprite: {
       laser: [0, 500],
       explosion: [500, 1000],
       powerup: [1500, 700]
     }
   });
   ```

3. **Lazy Load Audio**
   ```typescript
   // Load audio on user interaction
   button.addEventListener('click', async () => {
     const audio = await import('./audio/sfx.mp3');
     playSound(audio.default);
   });
   ```

### If Adding Fonts

1. **Subset Fonts**
   ```bash
   # Google Fonts with subset
   https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&text=ShapeCatcherGameScore0123456789
   ```

2. **Self-Host with Preload**
   ```html
   <link rel="preload" href="/fonts/game-font.woff2" as="font" type="font/woff2" crossorigin>
   ```

3. **Font Display Strategy**
   ```css
   @font-face {
     font-family: 'GameFont';
     src: url('/fonts/game-font.woff2') format('woff2');
     font-display: swap; /* Show fallback immediately */
   }
   ```

## Monitoring & Analysis

### Bundle Analysis
```bash
# Visualize bundle composition
npm run build
npx vite-bundle-visualizer
```

### Lighthouse Audit
```bash
# Check performance score
npx lighthouse https://your-game-url.com --view
```

### Network Analysis
- Use Chrome DevTools Network tab
- Check Coverage tab for unused code
- Monitor with `?debug` parameter

## Best Practices

1. **Keep it minimal**: Only add assets when absolutely necessary
2. **Optimize before adding**: Pre-process images, compress audio
3. **Lazy load**: Load assets on-demand, not upfront
4. **Cache effectively**: Use proper cache headers and versioning
5. **Monitor bundle size**: Set up alerts for bundle size increases

---

**Note**: The current game implementation successfully avoids external assets entirely, achieving excellent performance without traditional asset optimization. This document serves as a guide if future features require asset additions.
