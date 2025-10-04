# PWA Setup Guide

This guide explains the Progressive Web App (PWA) setup for Shape Catcher Game.

---

## What is a PWA?

A Progressive Web App allows users to:
- Install the game on their device (mobile/desktop)
- Play offline (with service worker caching)
- Get app-like experience (fullscreen, no browser UI)
- Add to home screen on mobile devices

---

## Current Setup

### ✅ Completed

1. **manifest.json** - PWA configuration
   - App name and icons
   - Display mode: standalone (fullscreen)
   - Theme colors
   - Orientation: portrait

2. **Meta tags** - SEO and PWA metadata
   - Open Graph tags
   - Twitter cards
   - Theme color
   - Apple touch icon

3. **robots.txt & sitemap.xml** - SEO
   - Search engine crawling
   - Site structure

### ⏳ Pending (Optional)

**Service Worker** - For offline support
- Cache game assets
- Enable offline gameplay
- Background sync

**Icons** - App icons
- icon-192.png (192x192)
- icon-512.png (512x512)
- apple-touch-icon.png (180x180)

**Screenshots** - For app stores
- screenshot-1.png (landscape)
- screenshot-2.png (portrait)

---

## How to Add Service Worker

### Option 1: Using Vite PWA Plugin

1. **Install plugin**
   ```bash
   npm install -D vite-plugin-pwa
   ```

2. **Update vite.config.ts**
   ```typescript
   import { VitePWA } from 'vite-plugin-pwa'

   export default defineConfig({
     plugins: [
       react(),
       VitePWA({
         registerType: 'autoUpdate',
         includeAssets: ['favicon.ico', 'robots.txt'],
         manifest: {
           name: 'Shape Catcher Game',
           short_name: 'Shape Catcher',
           theme_color: '#0f172a',
         },
         workbox: {
           globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
           runtimeCaching: [
             {
               urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
               handler: 'CacheFirst',
               options: {
                 cacheName: 'google-fonts-cache',
                 expiration: {
                   maxEntries: 10,
                   maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                 }
               }
             }
           ]
         }
       })
     ]
   })
   ```

3. **Update src/main.tsx**
   ```typescript
   // Register service worker
   if ('serviceWorker' in navigator) {
     window.addEventListener('load', () => {
       navigator.serviceWorker.register('/sw.js')
         .then(registration => console.log('SW registered'))
         .catch(err => console.log('SW registration failed'));
     });
   }
   ```

### Option 2: Manual Service Worker

1. **Create public/sw.js**
   ```javascript
   const CACHE_NAME = 'shape-catcher-v1';
   const urlsToCache = [
     '/',
     '/index.html',
     '/manifest.json',
     // Add your assets here
   ];

   self.addEventListener('install', (event) => {
     event.waitUntil(
       caches.open(CACHE_NAME)
         .then((cache) => cache.addAll(urlsToCache))
     );
   });

   self.addEventListener('fetch', (event) => {
     event.respondWith(
       caches.match(event.request)
         .then((response) => response || fetch(event.request))
     );
   });
   ```

2. **Register in src/main.tsx**
   ```typescript
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('/sw.js');
   }
   ```

---

## How to Create Icons

### Using Canvas (Programmatic)

Create a script to generate icons:

```typescript
// scripts/generateIcons.ts
const { createCanvas } = require('canvas');
const fs = require('fs');

function generateIcon(size: number, filename: string) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, size, size);

  // Draw game icon (simplified shapes)
  // ... your icon design here

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/${filename}`, buffer);
}

generateIcon(192, 'icon-192.png');
generateIcon(512, 'icon-512.png');
generateIcon(180, 'apple-touch-icon.png');
```

### Using Design Tools

**Figma/Sketch:**
1. Design icon at 512x512
2. Export as PNG
3. Use image optimizer to create smaller sizes

**Online Tools:**
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/

---

## Testing PWA

### Desktop (Chrome)

1. Open DevTools → Application tab
2. Check "Manifest" section
3. Click "Service Workers" to verify registration
4. Use "Lighthouse" to audit PWA score

### Mobile

1. Open site in Chrome (Android) or Safari (iOS)
2. Tap "Add to Home Screen"
3. App should open in standalone mode

### PWA Checklist

- [ ] HTTPS enabled (required for PWA)
- [ ] manifest.json present and valid
- [ ] Icons in correct sizes (192, 512)
- [ ] Service worker registered
- [ ] Offline fallback page
- [ ] Theme color matches design
- [ ] Lighthouse PWA score > 90

---

## Benefits of PWA

### For Users:
- **Faster loading** - Cached assets
- **Offline play** - Works without internet
- **App-like feel** - No browser UI
- **Easy access** - Icon on home screen
- **Low storage** - ~1MB vs native apps (100MB+)

### For Developers:
- **Single codebase** - Web + PWA
- **No app stores** - Direct distribution
- **Easy updates** - No app store review
- **Better SEO** - Web indexable
- **Cross-platform** - iOS, Android, Desktop

---

## Deployment Platforms & PWA

### Vercel
- ✅ HTTPS enabled by default
- ✅ Service worker support
- ✅ HTTP/2 for fast loading
- Configure headers in vercel.json

### Netlify
- ✅ HTTPS enabled by default
- ✅ Service worker support
- ✅ Asset optimization
- Configure in netlify.toml

### GitHub Pages
- ✅ HTTPS for custom domains
- ✅ Service worker support
- ⚠️ No server-side caching headers

---

## Current Status

**PWA Readiness: 60%**

✅ **Complete:**
- Manifest.json configured
- Meta tags added
- Theme colors set
- SEO optimized

⏳ **Pending:**
- Service worker implementation (optional)
- Icon assets (need design)
- Screenshots (need game footage)
- Offline support (optional)

**Next Steps:**
1. Create app icons (192x192, 512x512)
2. (Optional) Add service worker for offline play
3. Take screenshots for app stores
4. Test PWA on mobile devices
5. Lighthouse audit to verify PWA score

---

## Notes

- Service worker is **optional** for this game
  - Game requires no API calls
  - All logic is client-side
  - Assets are already optimized (68KB total)

- Icons can be generated programmatically
  - Use Canvas to draw shapes
  - Match game's visual style

- PWA works best on HTTPS
  - Vercel/Netlify provide HTTPS automatically
  - Required for service worker registration

---

## Resources

- [PWA Builder](https://www.pwabuilder.com/)
- [Google PWA Docs](https://web.dev/progressive-web-apps/)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)

---

**Shape Catcher is ready for PWA deployment! 🚀**

*Last updated: 2025-10-05*
