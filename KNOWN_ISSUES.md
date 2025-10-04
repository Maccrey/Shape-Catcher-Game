# Known Issues

This document tracks known issues and bugs discovered during QA testing.

## Critical Issues (P0)

### #1: TypeScript Build Errors
**Status**: 🔴 Open
**Severity**: Critical
**Discovered**: 2025-10-05

**Description**:
TypeScript compilation fails with multiple type errors preventing production build.

**Affected Files**:
- `src/components/Game/GameProgress.tsx` (Line 5)
- `src/components/Menu/GameOverScreen.tsx` (Line 16)
- `src/game/CatcherController.ts` (Lines 40, 45, 50, 66)
- `src/utils/performanceOptimization.ts` (Lines 10, 244)

**Errors**:
1. Property 'catchCount' does not exist on gameStore
2. Property 'statisticsManager' is optional but accessed without check
3. InputManager missing methods: isKeyPressed, getLastSwipe, clearSwipe
4. Missing React import and NodeJS namespace

**Root Cause**:
- Incomplete gameStore refactoring
- Unused legacy file (CatcherController.ts) with outdated API
- Type definition mismatches

**Recommended Fix**:
```typescript
// 1. Add catchCount to gameStore
interface GameState {
  catchCount: number;
  // ...
}

// 2. Remove or update CatcherController.ts (unused file)

// 3. Fix performanceOptimization.ts imports
import React from 'react';
// Replace NodeJS.Timeout with ReturnType<typeof setTimeout>
```

**Workaround**: None - blocks production build

**Priority**: Must fix before beta release

---

## High Priority Issues (P1)

### #2: Cross-Browser Testing Not Complete
**Status**: ⚠️ Open
**Severity**: High
**Discovered**: 2025-10-05

**Description**:
Game has only been tested in development environment. No testing on:
- Firefox
- Safari (desktop & mobile)
- Edge
- Mobile browsers (iOS Safari, Android Chrome)

**Impact**:
Unknown compatibility issues may exist in production.

**Recommended Action**:
Manual testing required on all major browsers before release.

**Test Checklist**:
- [ ] Chrome 90+ (desktop)
- [ ] Firefox 88+ (desktop)
- [ ] Safari 14+ (desktop)
- [ ] Edge 90+ (desktop)
- [ ] iOS Safari 14+ (mobile)
- [ ] Android Chrome 90+ (mobile)

---

### #3: Reduced Motion Support Incomplete
**Status**: ⚠️ Open
**Severity**: Medium
**Discovered**: 2025-10-05

**Description**:
Settings have reduced motion toggle, but doesn't respect system preference `prefers-reduced-motion`.

**Current Behavior**:
- User must manually enable reduced motion in settings
- System preference ignored

**Expected Behavior**:
- Auto-detect `prefers-reduced-motion: reduce`
- Apply reduced motion automatically
- Allow user override in settings

**Fix**:
```typescript
// Add to settings initialization
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Update animations conditionally
const animationDuration = prefersReducedMotion || settings.reducedMotion ? 0 : 0.3;
```

---

## Medium Priority Issues (P2)

### #4: No Error Tracking
**Status**: 📝 Enhancement
**Severity**: Low
**Discovered**: 2025-10-05

**Description**:
No error tracking or monitoring system integrated (Sentry, LogRocket, etc.)

**Impact**:
Production errors won't be automatically captured and reported.

**Recommendation**:
Integrate Sentry for error tracking before public release.

---

### #5: No Analytics
**Status**: 📝 Enhancement
**Severity**: Low
**Discovered**: 2025-10-05

**Description**:
No usage analytics or telemetry integrated.

**Impact**:
Cannot track user behavior, popular features, or usage patterns.

**Recommendation**:
Consider Google Analytics or Plausible for privacy-friendly analytics.

---

## Resolved Issues

### #✓: PostCSS/Tailwind Configuration Error
**Status**: ✅ Resolved
**Resolved**: 2025-10-04

**Description**:
Tailwind CSS v4 with PostCSS had compatibility issues during initial setup.

**Fix**:
Updated to `@tailwindcss/postcss` v4.1.14 with proper configuration.

---

## Issue Tracking Guidelines

### Severity Levels
- **Critical (P0)**: Blocks release, prevents core functionality
- **High (P1)**: Major issue, should fix before release
- **Medium (P2)**: Notable issue, nice to fix
- **Low (P3)**: Minor issue, can defer

### Status Labels
- 🔴 Open (Critical) - Immediate attention required
- ⚠️ Open (High/Medium) - Needs fixing
- 📝 Enhancement - Future improvement
- ✅ Resolved - Fixed and verified
- ❌ Closed (Won't Fix) - Decided not to address

### Reporting New Issues
When reporting a new issue, include:
1. **Title**: Brief, descriptive summary
2. **Severity**: P0/P1/P2/P3
3. **Description**: What's wrong?
4. **Steps to Reproduce**: How to trigger the issue
5. **Expected Behavior**: What should happen
6. **Actual Behavior**: What actually happens
7. **Environment**: Browser, OS, device
8. **Screenshots**: If applicable
9. **Recommended Fix**: If known

---

*Last updated: 2025-10-05*
