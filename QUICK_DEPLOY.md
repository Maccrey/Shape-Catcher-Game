# Quick Deploy Guide

Deploy Shape Catcher Game to production in under 5 minutes.

---

## Option 1: Vercel (Recommended)

### Why Vercel?
- ✅ Fastest deployment (< 2 minutes)
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier
- ✅ Zero configuration for Vite

### Steps

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login (opens browser)
vercel login

# 3. Deploy to production
vercel --prod
```

**That's it!** 🎉

You'll get a URL like: `https://shape-catcher.vercel.app`

---

## Option 2: Netlify

### Why Netlify?
- ✅ Simple deployment
- ✅ Automatic HTTPS
- ✅ Form handling (if needed later)
- ✅ Free tier

### Steps

```bash
# 1. Install Netlify CLI
npm i -g netlify-cli

# 2. Login
netlify login

# 3. Initialize (first time only)
netlify init

# 4. Deploy to production
netlify deploy --prod
```

**Done!** 🚀

You'll get a URL like: `https://shape-catcher.netlify.app`

---

## Option 3: GitHub Pages (Free)

### Why GitHub Pages?
- ✅ Completely free
- ✅ GitHub integration
- ✅ Custom domain support

### Steps

```bash
# 1. Install gh-pages
npm i -D gh-pages

# 2. Update package.json
# Add this script:
"deploy": "npm run build && gh-pages -d dist"

# 3. Update vite.config.ts
# Set base to your repo name:
base: '/shape-catcher-game/'

# 4. Deploy
npm run deploy
```

**Live!** 🎮

URL: `https://yourusername.github.io/shape-catcher-game/`

---

## Post-Deployment

### 1. Verify (2 minutes)

Visit your URL and check:
- [ ] Game loads
- [ ] Can start game
- [ ] Gameplay works
- [ ] Menus function
- [ ] No console errors

### 2. Run Lighthouse (3 minutes)

```bash
# Install Lighthouse
npm i -g lighthouse

# Run audit
lighthouse https://your-deployed-url.com --view
```

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 95+
- SEO: 90+

### 3. Test PWA (2 minutes)

On mobile:
1. Open site in Chrome/Safari
2. Tap "Add to Home Screen"
3. Open from home screen
4. Should open in fullscreen

---

## Troubleshooting

### Issue: Blank page after deployment
**Fix**: Check browser console for errors
- Likely a path issue
- Verify `base` in vite.config.ts

### Issue: Assets not loading (404)
**Fix**: Check network tab
- Assets should load from /assets/
- Verify build output in dist/

### Issue: Service Worker error
**Fix**: Service worker not implemented yet
- This is expected
- See PWA_SETUP_GUIDE.md to add it

---

## Next Steps

After successful deployment:

1. **Share with testers** (see [BETA_TESTING_GUIDE.md](BETA_TESTING_GUIDE.md))
2. **Monitor feedback** (create GitHub issues)
3. **Iterate** (fix bugs, add features)
4. **Announce** (social media, gaming communities)

---

## Custom Domain (Optional)

### Vercel
```bash
vercel domains add yourdomain.com
```

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS (follow Netlify instructions)

### GitHub Pages
1. Add CNAME file to public/
2. Update DNS to point to GitHub Pages

---

## Rollback (If needed)

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Netlify
```bash
# Via CLI
netlify deploy --alias=previous-version

# Or via UI: Deploys → Select → Publish
```

### GitHub Pages
```bash
git revert HEAD
git push origin main
npm run deploy
```

---

## Deploy Commands Cheatsheet

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# GitHub Pages
npm run deploy

# Preview production build locally
npm run build && npm run preview
```

---

## Monitoring (Optional)

Add to deployed site:

### Analytics
```html
<!-- Add to index.html -->
<script defer data-domain="yourdomain.com"
        src="https://plausible.io/js/script.js">
</script>
```

### Error Tracking
```bash
npm i @sentry/react
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for full setup.

---

**🚀 Deploy Shape Catcher in under 5 minutes!**

*For detailed deployment options, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)*
