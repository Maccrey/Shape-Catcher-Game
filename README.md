# Shape Catcher Game

A modern, accessible web-based arcade game where you catch falling shapes with matching colors and forms. Built with React, TypeScript, and Canvas 2D.

## Features

### Core Gameplay
- **Match & Catch**: Catch falling shapes by matching both shape type and color
- **20 Levels**: Progressive difficulty across 20 unique levels
- **Special Shapes**: Diamond, Rainbow, Golden Star, Bomb, and power-up shapes
- **Combo System**: Build combos with consecutive catches (3s window)
- **Lives System**: 3 lives with failure penalties

### Game Modes
- **Classic Mode**: 20 levels, 3 lives, progressive difficulty
- **Time Attack**: 3-minute time limit with unlimited lives
- **Endless Mode**: Infinite levels with ever-increasing difficulty
- **Daily Challenge**: Unique seeded challenge that changes daily

### Power-ups
- **Slow Time**: Reduces falling speed by 50% for 5 seconds
- **Auto Match**: Automatically catches next 3 shapes
- **Double Score**: 2x score multiplier for 10 seconds
- **Shield**: Negates next failure (1 use)
- **Star Shower**: Converts all shapes to diamonds for 5 seconds

### Visual Effects
- **Particle System**: Success, explosion, and special shape effects
- **Camera Effects**: Screen shake on bomb collision
- **Slow Motion**: Triggered at 15+ combo
- **Screen Glow**: Border effects at 10+ combo
- **Dynamic Backgrounds**: 6 unique animated themes across levels

### Audio System
- **Procedural Sound**: Web Audio API-based sound generation
- **Dynamic Music**: Level-based BGM with adaptive layers
- **Contextual SFX**: Unique sounds for actions, combos, and special events
- **Volume Controls**: Separate music and SFX volume settings

### Progression System
- **Achievements**: 20+ achievements to unlock
- **Statistics Tracking**: Total catches, misses, best combo, playtime
- **Local Leaderboard**: Top 10 scores per game mode
- **Persistent Data**: Progress saved to localStorage

### Customization
- **5 Catcher Skins**: Classic, Neon, Wooden, Metal, Rainbow
- **6 Background Themes**: Ocean, Sunset, Forest, Cosmic, Volcano, Aurora
- **Unlock System**: Earn skins and themes through achievements

### Accessibility
- **Colorblind Mode**: Unique patterns for each color (stripes, dots, diagonal, etc.)
- **ARIA Support**: Full screen reader compatibility
- **Keyboard Navigation**: Complete keyboard-only play support
- **Reduced Motion**: Optional animation reduction
- **High Contrast Mode**: Enhanced color contrast for visibility
- **WCAG AA Compliant**: 4.5:1 contrast ratio on all UI elements

### Tutorial & Help
- **Interactive Tutorial**: 10-step guided introduction for new players
- **Context-Aware Hints**: Helpful hints based on gameplay patterns
- **Keyboard Guide**: Press `?` to view all keyboard shortcuts

## Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/shape-catcher-game.git

# Navigate to project directory
cd shape-catcher-game

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Run unit tests
npm run test

# Run tests with UI
npm run test:ui
```

### Project Structure

```
src/
├── components/        # React components
│   ├── Game/          # Game-specific components
│   ├── UI/            # Reusable UI components
│   ├── Menu/          # Menu screens
│   └── Tutorial/      # Tutorial and hint system
├── core/              # Core game systems
│   ├── GameLoop.ts    # Main game loop
│   ├── GameEngine.ts  # Game engine orchestrator
│   ├── InputManager.ts # Input handling
│   ├── PhysicsEngine.ts # Physics simulation
│   ├── CameraController.ts # Camera effects
│   └── CollisionDetector.ts # AABB collision
├── game/              # Game logic
│   ├── entities/      # Game entities (Shape, Catcher)
│   ├── factories/     # Factory patterns
│   ├── managers/      # Manager classes
│   └── systems/       # Game systems
├── config/            # Configuration files
│   ├── constants.ts   # Game constants
│   ├── levelConfig.ts # Level definitions
│   ├── skinConfig.ts  # Skin configurations
│   └── themeConfig.ts # Theme definitions
├── store/             # Zustand state management
├── services/          # Service layer
│   ├── AudioService.ts # Audio management
│   └── StorageService.ts # Data persistence
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── styles/            # Global styles
```

## Controls

### Keyboard
- `←/→` - Move catcher left/right
- `↑/↓` - Change catcher shape
- `A/D` - Change catcher color
- `Space` - Use selected power-up
- `Esc` - Pause/Resume game
- `?` - Show keyboard guide

### Touch/Mobile
- **Swipe Left/Right** - Move catcher
- **Swipe Up/Down** - Change shape
- **Tap Left/Right** - Change color
- **Tap Power-up Icon** - Use power-up

## Game Mechanics

### Matching Rules
- **Normal Shapes**: Must match both shape type AND color
- **Diamond**: Only color must match (2x score)
- **Rainbow**: Only shape must match (1.5x score)
- **Golden Star**: Both must match exactly (3x score + power-up drop)
- **Bomb**: Always causes damage (-5 points, 1s stun, screen shake)

### Combo System
- Consecutive catches within 3 seconds build combo
- Combo tiers: 3, 5, 10, 15, 20 with increasing bonuses
- Missing a shape resets combo to 0
- High combos (15+) trigger slow-motion effect

### Level Progression
- Complete 20 catches to advance to next level
- Each level increases falling speed and spawn rate
- Color variety expands at levels 5, 10, and 15
- Level 20 is the final challenge

### Difficulty Levels
- **Easy**: 20% slower falling speed, 0.5s longer spawn interval
- **Normal**: Default balanced gameplay
- **Hard**: 20% faster falling speed, +5% bomb probability

## Building for Production

```bash
# Create optimized production build
npm run build

# Output will be in dist/ directory
# Bundle size target: < 500KB (gzipped)
```

### Build Optimizations
- Code splitting for optimal loading
- Tree shaking to remove unused code
- Terser minification
- Asset optimization and lazy loading
- Service worker caching (optional)

### Deployment

The project is ready to deploy to any static hosting service:

**Vercel:**
```bash
vercel
```

**Netlify:**
```bash
netlify deploy --prod
```

**GitHub Pages:**
```bash
npm run build
# Copy dist/ contents to gh-pages branch
```

## Testing

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

### QA Testing
See [QA_CHECKLIST.md](./QA_CHECKLIST.md) for comprehensive testing guidelines covering:
- Feature testing (200+ test cases)
- Cross-browser compatibility
- Performance benchmarks
- Accessibility compliance
- Bug validation

## Performance Targets

- **Desktop**: 60 FPS sustained
- **Mobile**: 30+ FPS sustained
- **Bundle Size**: < 500KB (gzipped)
- **Initial Load**: < 3 seconds
- **Lighthouse Performance**: 90+
- **Lighthouse Accessibility**: 90+

## Browser Support

- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Android Chrome 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes following conventional commits
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
```
<type>(<scope>): <subject>

Examples:
feat(game): add new powerup system
fix(ui): resolve button alignment issue
docs(readme): update installation instructions
perf(canvas): optimize rendering with dirty rectangles
```

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- State managed with [Zustand](https://github.com/pmndrs/zustand)
- Bundled with [Vite](https://vitejs.dev/)

## Support

For bugs, feature requests, or questions:
- Open an issue on GitHub
- Check existing documentation
- Review QA checklist for known issues

---

**Happy Gaming! 🎮✨**
