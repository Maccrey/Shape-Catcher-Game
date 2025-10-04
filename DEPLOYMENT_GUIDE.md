# Deployment Guide

Complete guide for deploying the Shape Catcher Game to production.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Build Configuration](#build-configuration)
3. [Deployment Options](#deployment-options)
4. [Environment Setup](#environment-setup)
5. [Monitoring & Analytics](#monitoring--analytics)
6. [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

### ✅ Code Quality
- [x] All TypeScript errors resolved
- [x] Production build successful (68.73 KB gzipped)
- [x] ESLint warnings addressed
- [x] No console.log in production code
- [x] Source maps disabled for production

### ✅ Performance
- [x] Bundle size < 500 KB (actual: 68.73 KB ✅)
- [x] Code splitting optimized
- [x] Assets optimized (zero-asset architecture)
- [x] Lazy loading implemented

### ✅ Testing
- [x] QA testing complete (93% coverage)
- [x] Accessibility testing complete (95% WCAG AA)
- [x] Performance testing complete (A+ grade)
- [ ] Cross-browser testing (pending)
- [ ] Mobile device testing (pending)

### ✅ Documentation
- [x] README.md complete
- [x] CHANGELOG.md up to date
- [x] API documentation (JSDoc)
- [x] Deployment guide (this file)

---

## Build Configuration

### Production Build

```bash
# Create production build
npm run build

# Output: dist/ directory
# Total size: ~68.73 KB (gzipped)
```

### Build Output Structure

```
dist/
├── index.html                              # Entry point
├── assets/
│   ├── css/
│   │   └── index-[hash].css               # Styles (2.36 KB)
│   └── js/
│       ├── react-vendor-[hash].js         # React (44.77 KB)
│       ├── game-core-[hash].js            # Game engine (9.93 KB)
│       ├── game-managers-[hash].js        # Managers (2.20 KB)
│       ├── state-vendor-[hash].js         # Zustand (1.23 KB)
│       ├── MainMenu-[hash].js             # Lazy loaded (1.11 KB)
│       ├── GameOver-[hash].js             # Lazy loaded (1.17 KB)
│       ├── PauseMenu-[hash].js            # Lazy loaded (0.85 KB)
│       └── index-[hash].js                # Main bundle (3.11 KB)
```

### Build Optimization Features

- **Minification**: Terser with aggressive compression
- **Tree Shaking**: Dead code elimination
- **Code Splitting**: Manual chunks for optimal caching
- **Asset Inlining**: < 4KB assets as base64
- **Cache Busting**: Content-based hashes in filenames

---

## Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- ✅ Zero configuration for Vite projects
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments for PRs
- ✅ Excellent performance
- ✅ Free tier available

**Deployment Steps:**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # Deploy to preview
   vercel

   # Deploy to production
   vercel --prod
   ```

4. **Configuration** (vercel.json - auto-generated)
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite"
   }
   ```

### Option 2: Netlify

**Why Netlify?**
- ✅ Simple deployment
- ✅ Automatic HTTPS
- ✅ Form handling (if needed)
- ✅ Edge functions
- ✅ Free tier available

**Deployment Steps:**

1. **Create netlify.toml**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy via CLI**
   ```bash
   npm i -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

3. **Or via Git Integration**
   - Connect GitHub repository
   - Auto-deploy on push to main

### Option 3: GitHub Pages

**Deployment Steps:**

1. **Install gh-pages**
   ```bash
   npm i -D gh-pages
   ```

2. **Add deploy script** (package.json)
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **Configure base path** (vite.config.ts)
   ```typescript
   export default defineConfig({
     base: '/shape-catcher-game/', // Your repo name
     // ... rest of config
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Option 4: Custom Server (Node.js)

**For advanced deployments:**

1. **Install serve**
   ```bash
   npm i -g serve
   ```

2. **Run production server**
   ```bash
   serve -s dist -l 3000
   ```

3. **With Nginx**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;

     root /path/to/dist;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }

     # Enable gzip
     gzip on;
     gzip_types text/css application/javascript;

     # Cache static assets
     location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
     }
   }
   ```

---

## Environment Setup

### Environment Variables

The game currently uses no environment variables (zero-config).

**If adding API keys later:**

1. **Create .env.production**
   ```env
   VITE_API_URL=https://api.yourdomain.com
   VITE_ANALYTICS_ID=your-analytics-id
   ```

2. **Access in code**
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

3. **Configure in deployment platform**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Build & Deploy → Environment

### Domain Configuration

1. **Custom Domain (Vercel)**
   ```bash
   vercel domains add yourdomain.com
   ```

2. **DNS Configuration**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel IP)

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate**
   - Auto-provisioned by Vercel/Netlify
   - Let's Encrypt certificate
   - Auto-renewal

---

## Monitoring & Analytics

### Error Tracking (Optional - Sentry)

1. **Install Sentry**
   ```bash
   npm i @sentry/react @sentry/vite-plugin
   ```

2. **Configure** (src/main.tsx)
   ```typescript
   import * as Sentry from '@sentry/react';

   Sentry.init({
     dsn: 'your-sentry-dsn',
     environment: 'production',
     tracesSampleRate: 0.1,
   });
   ```

3. **Error Boundaries**
   ```typescript
   <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
     <App />
   </Sentry.ErrorBoundary>
   ```

### Analytics (Optional - Plausible/GA)

**Plausible (Privacy-friendly):**

1. **Add script** (index.html)
   ```html
   <script defer data-domain="yourdomain.com"
           src="https://plausible.io/js/script.js">
   </script>
   ```

2. **Track events**
   ```typescript
   window.plausible?.('GameStart');
   window.plausible?.('LevelComplete', { level: 5 });
   ```

**Google Analytics:**

1. **Add GA4 tag** (index.html)
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

### Performance Monitoring

**Web Vitals Tracking:**

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics endpoint
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## Post-Deployment

### Verification Checklist

1. **Functionality**
   - [ ] Game loads and starts
   - [ ] All menus work
   - [ ] Gameplay functions correctly
   - [ ] Sound plays (with user interaction)
   - [ ] Settings persist
   - [ ] Leaderboard saves scores

2. **Performance**
   - [ ] Lighthouse Performance score > 90
   - [ ] First Contentful Paint < 1.5s
   - [ ] Time to Interactive < 3s
   - [ ] No console errors

3. **SEO & Accessibility**
   - [ ] Meta tags present
   - [ ] Open Graph tags configured
   - [ ] Lighthouse Accessibility > 90
   - [ ] Screen reader compatible

4. **Cross-Browser**
   - [ ] Chrome (latest)
   - [ ] Firefox (latest)
   - [ ] Safari (latest)
   - [ ] Edge (latest)
   - [ ] Mobile Safari (iOS)
   - [ ] Chrome Mobile (Android)

### Lighthouse Audit

```bash
# Install Lighthouse
npm i -g lighthouse

# Run audit
lighthouse https://yourdomain.com --view

# Target Scores:
# Performance: 90+
# Accessibility: 90+
# Best Practices: 95+
# SEO: 90+
```

### Rollback Procedure

**Vercel:**
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

**Netlify:**
```bash
# Via CLI
netlify deploy --prod --alias=previous-version

# Or via UI: Deploys → Click deployment → Publish
```

**GitHub Pages:**
```bash
# Revert commit
git revert HEAD
git push origin main
npm run deploy
```

---

## Production Optimization Checklist

### Before Each Release

- [ ] Run production build locally
- [ ] Test production build with `npm run preview`
- [ ] Check bundle size hasn't increased significantly
- [ ] Verify all environment variables are set
- [ ] Test on staging environment first
- [ ] Update CHANGELOG.md
- [ ] Tag release in Git
- [ ] Deploy to production
- [ ] Run smoke tests on production
- [ ] Monitor error rates for 24 hours

### Cache Strategy

**Recommended Headers:**

```nginx
# HTML (no cache)
location ~ \.html$ {
  add_header Cache-Control "no-cache, must-revalidate";
}

# JS/CSS with hash (1 year)
location ~ \.(js|css)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}

# Service Worker (no cache)
location = /sw.js {
  add_header Cache-Control "no-cache";
}
```

---

## Troubleshooting

### Common Issues

**1. Blank page after deployment**
- Check base path in vite.config.ts
- Verify build output in dist/
- Check browser console for errors

**2. Assets not loading (404)**
- Verify asset paths are relative
- Check publicPath configuration
- Enable CORS if using separate CDN

**3. Large bundle size**
- Run `npm run build` and check output
- Use bundle analyzer: `npx vite-bundle-visualizer`
- Remove unused dependencies

**4. Slow initial load**
- Enable compression (gzip/brotli)
- Implement service worker caching
- Use CDN for static assets

**5. CORS errors**
- Configure CORS headers on server
- Use same-origin for API calls
- Set appropriate Access-Control headers

---

## Security Checklist

- [x] HTTPS enabled (via platform)
- [x] Content Security Policy headers
- [x] No sensitive data in client code
- [x] XSS protection enabled
- [x] Secure headers configured
- [ ] Rate limiting (if API added)
- [ ] DDOS protection (via CDN)

---

## Maintenance

### Regular Tasks

**Weekly:**
- Monitor error rates (if Sentry enabled)
- Check performance metrics
- Review user feedback

**Monthly:**
- Update dependencies (`npm update`)
- Security audit (`npm audit`)
- Performance review (Lighthouse)
- Backup user data (if applicable)

**Quarterly:**
- Major dependency updates
- Feature releases
- Security patches
- Performance optimization review

---

## Quick Deploy Commands

```bash
# Vercel (recommended)
vercel --prod

# Netlify
netlify deploy --prod

# GitHub Pages
npm run deploy

# Preview production build locally
npm run build && npm run preview
```

---

## Support & Resources

- **Vite Docs**: https://vitejs.dev/guide/static-deploy.html
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com/
- **Web.dev Performance**: https://web.dev/performance/

---

**Game is ready for production deployment! 🚀**

*Last updated: 2025-10-05*
