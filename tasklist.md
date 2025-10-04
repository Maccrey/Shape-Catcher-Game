# Shape Catcher Game - 개발 태스크 리스트

## 개발 원칙

- **최소 단위 구현**: 각 기능을 독립적인 최소 단위로 분할
- **테스트 주도**: 구현 → 테스트 → 통과 → 정리 → 완료체크 → 커밋
- **클린 코드**: 관심사 분리, 단일 책임 원칙, 의존성 주입
- **완료 체크**: 최소단위 구현 완료후 tastlist.md에 완료 체크
- **커밋 규칙**: `<type>(<scope>): <subject>` 형식 준수

## 진행 상태 표기

- `[ ]` 미착수
- `[~]` 진행중
- `[x]` 완료

---

## Phase 1: MVP (4주) - 핵심 게임플레이

### Week 1: 기본 구조

#### 1.1 프로젝트 셋업 [P0]

- [ ] **1.1.1** Vite + React + TypeScript 프로젝트 생성

  ```bash
  npm create vite@latest shape-catcher -- --template react-ts
  ```

  - 테스트: 개발 서버 실행 확인
  - 커밋: `chore(setup): initialize vite project with react-ts template`

- [ ] **1.1.2** 의존성 설치

  ```bash
  npm install zustand tailwindcss postcss autoprefixer
  npm install framer-motion gsap howler
  npm install -D @types/howler vitest @vitest/ui @testing-library/react @testing-library/jest-dom
  ```

  - 테스트: package.json 확인
  - 커밋: `chore(deps): add core dependencies and dev tools`

- [ ] **1.1.3** Tailwind CSS 설정

  - tailwind.config.js 생성 및 설정
  - postcss.config.js 설정
  - src/styles/globals.css 생성 및 @tailwind 지시어 추가
  - 테스트: 간단한 Tailwind 클래스 적용 확인
  - 커밋: `chore(config): configure tailwind css`

- [ ] **1.1.4** TypeScript 엄격 모드 설정
  - tsconfig.json에 strict: true 설정
  - 추가 컴파일러 옵션 설정 (noUnusedLocals, noUnusedParameters 등)
  - 테스트: 빌드 에러 없음 확인
  - 커밋: `chore(config): enable typescript strict mode`

#### 1.2 폴더 구조 생성 [P0]

- [ ] **1.2.1** 디렉토리 구조 생성

  ```bash
  mkdir -p src/{components/{Game,UI,Menu,Tutorial},core,game,store,config,utils,types,hooks,services,styles}
  mkdir -p public/assets/{audio/{bgm,sfx},images/{backgrounds,skins,icons},fonts}
  mkdir -p tests/{unit,integration,e2e}
  ```

  - 테스트: 폴더 구조 확인
  - 커밋: `chore(structure): create project directory structure`

- [ ] **1.2.2** 기본 타입 정의 생성

  - src/types/game.types.ts
    - GameStatus, DifficultyLevel 등 기본 enum
  - src/types/shape.types.ts
    - ShapeType, ShapeColor, SpecialShapeType, Shape 인터페이스
  - src/types/level.types.ts
    - LevelConfig 인터페이스
  - 테스트: 타입 import 및 사용 확인
  - 커밋: `feat(types): define core type definitions`

- [ ] **1.2.3** 상수 파일 생성
  - src/config/constants.ts
    - CANVAS_WIDTH, CANVAS_HEIGHT, FPS, CATCHER_HEIGHT 등
  - 테스트: 상수 import 및 사용 확인
  - 커밋: `feat(config): add game constants`

#### 1.3 Canvas 렌더링 시스템 [P0]

- [ ] **1.3.1** Canvas 컴포넌트 기본 구조

  - src/components/Game/Canvas.tsx 생성
  - Canvas 요소 렌더링 (반응형 크기)
  - useRef로 canvas 참조
  - 테스트: Canvas 요소가 DOM에 렌더링되는지 확인
  - 커밋: `feat(canvas): create basic canvas component`

- [ ] **1.3.2** Canvas Context 초기화

  - getContext('2d') 획득
  - 기본 렌더링 설정 (fillStyle, strokeStyle 등)
  - 에러 핸들링 (Canvas 미지원 브라우저)
  - 테스트: Context가 정상적으로 획득되는지 확인
  - 커밋: `feat(canvas): initialize canvas 2d context`

- [ ] **1.3.3** 더블 버퍼링 구현

  - 오프스크린 캔버스 생성
  - 렌더링 최적화 로직
  - 테스트: 깜빡임 없이 렌더링되는지 확인
  - 커밋: `feat(canvas): implement double buffering for smooth rendering`

- [ ] **1.3.4** 기본 도형 렌더링 유틸리티
  - src/utils/renderUtils.ts 생성
  - drawSquare, drawTriangle, drawStar, drawCircle 함수
  - 각 도형의 정확한 기하학적 계산
  - 테스트: 각 도형이 정확하게 그려지는지 시각적 확인
  - 커밋: `feat(render): add shape rendering utilities`

#### 1.4 게임 루프 구현 [P0]

- [ ] **1.4.1** GameLoop 클래스 뼈대

  - src/core/GameLoop.ts 생성
  - requestAnimationFrame 기반 루프
  - FPS 제한 로직 (60fps)
  - 테스트: 루프가 정상적으로 실행되는지 확인
  - 커밋: `feat(core): create game loop with fps control`

- [ ] **1.4.2** 시간 관리 시스템

  - deltaTime 계산
  - 고정 타임스텝 vs 가변 타임스텝
  - 시간 스케일 (파워업용)
  - 테스트: deltaTime이 정확하게 계산되는지 확인
  - 커밋: `feat(core): implement time management system`

- [ ] **1.4.3** 게임 루프 생명주기

  - start(), stop(), pause(), resume() 메서드
  - 상태 관리 (running, paused)
  - 테스트: 각 메서드가 정상 동작하는지 확인
  - 커밋: `feat(core): add game loop lifecycle methods`

- [ ] **1.4.4** GameEngine 통합
  - src/core/GameEngine.ts 생성
  - GameLoop 인스턴스 관리
  - update(), render() 메서드 분리
  - 테스트: GameEngine이 GameLoop와 통합되어 동작하는지 확인
  - 커밋: `feat(core): create game engine with integrated loop`

#### 1.5 입력 시스템 [P0]

- [ ] **1.5.1** InputManager 기본 구조

  - src/core/InputManager.ts 생성
  - 싱글톤 패턴 적용
  - 키보드 이벤트 리스너
  - 테스트: 키 입력이 감지되는지 확인
  - 커밋: `feat(input): create input manager with keyboard support`

- [ ] **1.5.2** 키보드 입력 처리

  - 화살표 키 (←, →, ↑, ↓) 감지
  - Space, Esc 키 감지
  - keyDown, keyUp 상태 관리
  - 테스트: 각 키 입력이 정확하게 감지되는지 확인
  - 커밋: `feat(input): implement keyboard input handling`

- [ ] **1.5.3** 터치 입력 처리

  - Pointer Events API 사용
  - 터치 시작, 이동, 종료 이벤트
  - 스와이프 제스처 감지 (상하좌우)
  - 테스트: 터치 이벤트가 정상 동작하는지 확인 (모바일 또는 DevTools)
  - 커밋: `feat(input): add touch input support with pointer events`

- [ ] **1.5.4** 입력 버퍼링 및 디바운싱

  - 빠른 연속 입력 방지 (50ms)
  - 스와이프 임계값 설정 (30px)
  - 입력 큐 관리
  - 테스트: 빠른 연속 입력이 적절하게 처리되는지 확인
  - 커밋: `feat(input): implement input buffering and debouncing`

- [ ] **1.5.5** 크로스 플랫폼 입력 통합
  - 데스크톱/모바일 자동 감지
  - 디바이스별 입력 매핑
  - src/utils/deviceDetector.ts 생성
  - 테스트: 각 플랫폼에서 입력이 정상 동작하는지 확인
  - 커밋: `feat(input): integrate cross-platform input handling`

---

### Week 2: 게임 메카닉

#### 2.1 도형 시스템 [P0]

- [ ] **2.1.1** Shape 클래스 구현

  - src/game/entities/Shape.ts 생성
  - 속성: id, type, color, position, velocity, size
  - 메서드: update(), isOffScreen()
  - 테스트: Shape 인스턴스 생성 및 업데이트 확인
  - 커밋: `feat(entity): create shape entity class`

- [ ] **2.1.2** ShapeFactory 패턴 구현

  - src/game/factories/ShapeFactory.ts 생성
  - 4가지 기본 도형 생성 메서드
  - 랜덤 색상 할당
  - 테스트: 각 타입의 도형이 정확하게 생성되는지 확인
  - 커밋: `feat(factory): implement shape factory pattern`

- [ ] **2.1.3** ShapeManager 구현

  - src/game/ShapeManager.ts 생성
  - 도형 생성, 제거 관리
  - 현재 도형, 다음 도형 관리
  - 테스트: 도형 생성 및 제거가 정상 동작하는지 확인
  - 커밋: `feat(game): create shape manager`

- [ ] **2.1.4** 도형 생성 규칙 구현
  - 순차 생성 로직 (한 번에 1개)
  - 랜덤 X축 위치 (마진 20px)
  - 생성 타이밍 제어
  - 테스트: 도형이 규칙에 맞게 생성되는지 확인
  - 커밋: `feat(game): implement shape spawning rules`

#### 2.2 캐처 시스템 [P0]

- [ ] **2.2.1** Catcher 클래스 구현

  - src/game/entities/Catcher.ts 생성
  - 속성: position, currentShape, currentColor, state
  - 메서드: moveLeft(), moveRight(), changeShape(), changeColor()
  - 테스트: Catcher 인스턴스 생성 및 메서드 동작 확인
  - 커밋: `feat(entity): create catcher entity class`

- [ ] **2.2.2** CatcherController 구현

  - src/game/CatcherController.ts 생성
  - 입력을 받아 Catcher 제어
  - 화면 경계 제한
  - 테스트: 입력에 따라 Catcher가 올바르게 이동하는지 확인
  - 커밋: `feat(game): create catcher controller`

- [ ] **2.2.3** Catcher 렌더링

  - src/components/Game/Catcher.tsx 생성
  - 도형 타입별 캐처 형태 렌더링
  - 색상 표시
  - 테스트: 각 상태의 Catcher가 정확하게 렌더링되는지 확인
  - 커밋: `feat(render): implement catcher rendering`

- [ ] **2.2.4** Catcher 애니메이션
  - 이동 부드러움 (보간)
  - 도형 변경 트랜지션
  - 색상 변경 트랜지션
  - 테스트: 애니메이션이 부드럽게 동작하는지 확인
  - 커밋: `feat(animation): add catcher animations`

#### 2.3 충돌 감지 시스템 [P0]

- [ ] **2.3.1** CollisionDetector 클래스 구현

  - src/core/CollisionDetector.ts 생성
  - AABB 알고리즘 구현
  - checkCollision(shape, catcher) 메서드
  - 테스트: 충돌 감지가 정확한지 단위 테스트
  - 커밋: `feat(core): implement AABB collision detection`

- [ ] **2.3.2** 매칭 로직 구현

  - isMatch(shape, catcher) 메서드
  - 도형 + 색상 일치 확인
  - 테스트: 다양한 케이스에 대해 매칭 확인
  - 커밋: `feat(game): implement shape matching logic`

- [ ] **2.3.3** 충돌 결과 처리
  - 성공 시: 도형 제거, 점수 증가
  - 실패 시: 도형 낙하, 생명 감소
  - 테스트: 결과가 올바르게 처리되는지 확인
  - 커밋: `feat(game): handle collision results`

#### 2.4 물리 엔진 [P0]

- [ ] **2.4.1** PhysicsEngine 클래스 구현

  - src/core/PhysicsEngine.ts 생성
  - 중력 적용
  - 속도 업데이트
  - 테스트: 물리 계산이 정확한지 확인
  - 커밋: `feat(core): create physics engine with gravity`

- [ ] **2.4.2** 도형 낙하 구현
  - 레벨별 낙하 속도 적용
  - deltaTime 기반 이동
  - 테스트: 도형이 일정한 속도로 낙하하는지 확인
  - 커밋: `feat(physics): implement shape falling mechanics`

#### 2.5 다음 도형 미리보기 [P0]

- [ ] **2.5.1** NextShapePreview 컴포넌트

  - src/components/Game/NextShapePreview.tsx 생성
  - 다음 도형 정보 표시
  - 작은 크기로 렌더링
  - 테스트: 다음 도형이 정확하게 표시되는지 확인
  - 커밋: `feat(ui): create next shape preview component`

- [ ] **2.5.2** ShapeManager와 연동
  - nextShape 생성 로직
  - 현재 도형 캐치 시 nextShape → currentShape
  - 테스트: 미리보기와 실제 도형이 일치하는지 확인
  - 커밋: `feat(game): integrate next shape preview with manager`

#### 2.6 점수 시스템 [P0]

- [ ] **2.6.1** ScoreCalculator 구현

  - src/game/ScoreCalculator.ts 생성
  - 기본 점수 계산
  - calculateScore(shape, level) 메서드
  - 테스트: 점수 계산이 정확한지 단위 테스트
  - 커밋: `feat(game): implement score calculator`

- [ ] **2.6.2** 점수 상태 관리
  - gameStore에 score 상태 추가
  - addScore() 액션
  - 테스트: 점수가 정확하게 누적되는지 확인
  - 커밋: `feat(store): add score state management`

---

### Week 3: 레벨 시스템

#### 3.1 레벨 설정 데이터 [P0]

- [ ] **3.1.1** levelConfig.ts 작성

  - src/config/levelConfig.ts 생성
  - 레벨 1-20 설정 데이터
  - fallSpeed, spawnInterval, colorCount 등
  - 테스트: 설정 데이터 로드 확인
  - 커밋: `feat(config): add level configuration data (1-20)`

- [ ] **3.1.2** 레벨별 테마 설정
  - background, bgAnimation, music, particleColor
  - 테마별 색상 팔레트
  - 테스트: 테마 데이터 확인
  - 커밋: `feat(config): add level theme configurations`

#### 3.2 LevelManager 구현 [P0]

- [ ] **3.2.1** LevelManager 클래스

  - src/game/LevelManager.ts 생성
  - 현재 레벨 관리
  - getCurrentLevelConfig() 메서드
  - 테스트: 레벨 설정이 올바르게 반환되는지 확인
  - 커밋: `feat(game): create level manager`

- [ ] **3.2.2** 레벨 진행 로직

  - checkLevelComplete() 메서드
  - nextLevel() 메서드
  - 클리어 조건 확인 (20개 캐치)
  - 테스트: 레벨 진행이 정상 동작하는지 확인
  - 커밋: `feat(game): implement level progression logic`

- [ ] **3.2.3** 난이도 곡선 적용
  - 레벨별 낙하 속도 증가
  - 생성 간격 감소
  - 색상 종류 증가
  - 테스트: 난이도가 점진적으로 증가하는지 확인
  - 커밋: `feat(game): apply difficulty curve across levels`

#### 3.3 레벨 전환 화면 [P0]

- [ ] **3.3.1** LevelTransition 컴포넌트

  - src/components/Menu/LevelTransition.tsx 생성
  - 레벨 클리어 정보 표시
  - 획득 점수, 등급 표시
  - 테스트: 컴포넌트 렌더링 확인
  - 커밋: `feat(ui): create level transition screen`

- [ ] **3.3.2** 전환 애니메이션

  - Framer Motion으로 애니메이션
  - Fade in/out 효과
  - 테스트: 애니메이션이 부드럽게 동작하는지 확인
  - 커밋: `feat(animation): add level transition animations`

- [ ] **3.3.3** 레벨 전환 흐름 통합
  - gameStore에 gameStatus 상태 추가
  - 'levelTransition' 상태 처리
  - 자동 진행 (3초 후 다음 레벨)
  - 테스트: 레벨 전환이 자동으로 진행되는지 확인
  - 커밋: `feat(game): integrate level transition flow`

#### 3.4 진행도 UI [P0]

- [ ] **3.4.1** ProgressBar 컴포넌트

  - src/components/UI/ProgressBar.tsx 생성
  - 현재 레벨 진행도 표시 (X/20)
  - 시각적 바 표시
  - 테스트: 진행도가 정확하게 표시되는지 확인
  - 커밋: `feat(ui): create progress bar component`

- [ ] **3.4.2** gameStore 연동
  - catchCount 상태 추가
  - 캐치 성공 시 증가
  - 20개 도달 시 레벨 클리어
  - 테스트: 진행도가 실시간 업데이트되는지 확인
  - 커밋: `feat(store): integrate progress tracking`

---

### Week 4: 기본 UI & 테스트

#### 4.1 상태바 [P0]

- [ ] **4.1.1** StatusBar 컴포넌트

  - src/components/UI/StatusBar.tsx 생성
  - 레벨, 점수, 생명, 콤보 표시
  - Tailwind로 스타일링
  - 테스트: 모든 정보가 정확하게 표시되는지 확인
  - 커밋: `feat(ui): create status bar component`

- [ ] **4.1.2** 생명 시스템 구현

  - gameStore에 lives 상태 추가 (초기값 3)
  - 실패 시 lives 감소
  - lives 0 시 게임 오버
  - 테스트: 생명 시스템이 정상 동작하는지 확인
  - 커밋: `feat(game): implement lives system`

- [ ] **4.1.3** 하트 아이콘 표시
  - 생명 수만큼 하트 렌더링
  - 잃은 생명은 회색 하트
  - 테스트: 하트가 정확하게 표시되는지 확인
  - 커밋: `feat(ui): add heart icons for lives display`

#### 4.2 메인 메뉴 [P0]

- [ ] **4.2.1** MainMenu 컴포넌트

  - src/components/Menu/MainMenu.tsx 생성
  - 게임 시작 버튼
  - 설정 버튼
  - 테스트: 메뉴가 렌더링되고 버튼이 동작하는지 확인
  - 커밋: `feat(ui): create main menu component`

- [ ] **4.2.2** 메뉴 디자인

  - 게임 타이틀
  - 버튼 스타일링 (Tailwind)
  - hover 효과
  - 테스트: 시각적 확인
  - 커밋: `style(ui): design main menu layout`

- [ ] **4.2.3** 게임 시작 흐름
  - startGame() 액션 구현
  - gameStatus를 'menu' → 'playing'으로 변경
  - 초기 상태 설정
  - 테스트: 게임이 정상적으로 시작되는지 확인
  - 커밋: `feat(game): implement game start flow`

#### 4.3 게임 오버 화면 [P0]

- [ ] **4.3.1** GameOverScreen 컴포넌트

  - src/components/Menu/GameOverScreen.tsx 생성
  - 최종 점수 표시
  - 재시작 버튼
  - 메인 메뉴 버튼
  - 테스트: 게임 오버 화면이 표시되는지 확인
  - 커밋: `feat(ui): create game over screen`

- [ ] **4.3.2** 게임 오버 통계

  - 도달 레벨
  - 총 캐치 수
  - 최고 콤보
  - 테스트: 통계가 정확하게 표시되는지 확인
  - 커밋: `feat(ui): add game over statistics`

- [ ] **4.3.3** 재시작 기능
  - restartGame() 액션
  - 모든 게임 상태 초기화
  - 테스트: 재시작이 정상 동작하는지 확인
  - 커밋: `feat(game): implement restart functionality`

#### 4.4 일시정지 기능 [P0]

- [ ] **4.4.1** PauseMenu 컴포넌트

  - src/components/Menu/PauseMenu.tsx 생성
  - 재개 버튼
  - 재시작 버튼
  - 메인 메뉴 버튼
  - 테스트: 일시정지 메뉴가 표시되는지 확인
  - 커밋: `feat(ui): create pause menu component`

- [ ] **4.4.2** 일시정지/재개 로직

  - pauseGame(), resumeGame() 액션
  - Esc 키로 일시정지
  - GameLoop pause/resume 연동
  - 테스트: 일시정지와 재개가 정상 동작하는지 확인
  - 커밋: `feat(game): implement pause/resume logic`

- [ ] **4.4.3** 오버레이 효과
  - 반투명 배경
  - 게임 화면 위에 표시
  - 테스트: 시각적 확인
  - 커밋: `style(ui): add pause menu overlay effect`

#### 4.5 반응형 레이아웃 [P0]

- [ ] **4.5.1** 모바일 레이아웃

  - Tailwind 반응형 클래스 사용
  - 세로 모드 최적화
  - 터치 영역 확대 (44x44px 이상)
  - 테스트: 모바일 기기에서 확인 (DevTools)
  - 커밋: `feat(responsive): optimize layout for mobile`

- [ ] **4.5.2** 데스크톱 레이아웃

  - 가로 모드 최적화
  - 최대 너비 제한
  - 중앙 정렬
  - 테스트: 데스크톱 브라우저에서 확인
  - 커밋: `feat(responsive): optimize layout for desktop`

- [ ] **4.5.3** 태블릿 레이아웃
  - 중간 크기 최적화
  - 가로/세로 모드 지원
  - 테스트: 태블릿 크기에서 확인
  - 커밋: `feat(responsive): optimize layout for tablet`

#### 4.6 기본 QA 및 버그 수정 [P0]

- [ ] **4.6.1** 기능 테스트 체크리스트

  - [ ] 도형이 정상적으로 떨어지는가?
  - [ ] 캐처가 정확하게 이동하는가?
  - [ ] 충돌 감지가 정확한가?
  - [ ] 점수가 올바르게 계산되는가?
  - [ ] 레벨 진행이 정상 동작하는가?
  - [ ] 생명 시스템이 정상 동작하는가?
  - [ ] 게임 오버가 정확하게 발생하는가?
  - 커밋: `test(qa): complete functional testing checklist`

- [ ] **4.6.2** 크로스 브라우저 테스트

  - Chrome, Firefox, Safari, Edge에서 테스트
  - 발견된 버그 수정
  - 커밋: `fix(compat): resolve cross-browser compatibility issues`

- [ ] **4.6.3** 성능 프로파일링
  - Chrome DevTools Performance 탭 사용
  - 60fps 유지 확인
  - 병목 지점 최적화
  - 커밋: `perf(optimize): improve rendering performance`

---

## Phase 2: 재미 요소 (3주)

### Week 5: 특수 도형 & 콤보

#### 5.1 특수 도형 구현 [P1]

- [ ] **5.1.1** SpecialShapeType enum 정의

  - Diamond, Rainbow, GoldenStar, Bomb, TimeBonus, Multiplier
  - shape.types.ts에 추가
  - 테스트: 타입 정의 확인
  - 커밋: `feat(types): add special shape types`

- [ ] **5.1.2** 특수 도형 렌더링

  - renderUtils.ts에 특수 도형 그리기 함수 추가
  - 각 특수 도형의 고유한 모양
  - 글로우 효과, 트레일 효과
  - 테스트: 각 특수 도형이 정확하게 렌더링되는지 확인
  - 커밋: `feat(render): add special shape rendering`

- [ ] **5.1.3** 특수 도형 확률 시스템

  - ShapeFactory에 확률 로직 추가
  - 레벨별 특수 도형 확률 적용
  - 테스트: 확률에 맞게 생성되는지 확인
  - 커밋: `feat(factory): implement special shape spawn probability`

- [ ] **5.1.4** 다이아몬드 매칭 로직

  - 색상만 맞으면 성공
  - 2배 점수 배율
  - 테스트: 다이아몬드 매칭이 정확한지 확인
  - 커밋: `feat(game): add diamond matching logic`

- [ ] **5.1.5** 레인보우 매칭 로직

  - 도형만 맞으면 성공
  - 1.5배 점수 배율
  - 테스트: 레인보우 매칭이 정확한지 확인
  - 커밋: `feat(game): add rainbow matching logic`

- [ ] **5.1.6** 골든 스타 매칭 로직

  - 정확히 일치해야 성공
  - 3배 점수 배율
  - 파워업 드롭
  - 테스트: 골든 스타 매칭과 파워업 드롭 확인
  - 커밋: `feat(game): add golden star matching with powerup drop`

- [ ] **5.1.7** 폭탄 충돌 처리

  - 충돌 시 -5점
  - 캐처 1초 스턴
  - 화면 진동 (카메라 쉐이크)
  - 테스트: 폭탄 충돌이 정확하게 처리되는지 확인
  - 커밋: `feat(game): implement bomb collision penalty`

- [ ] **5.1.8** 타임 보너스 처리

  - 시간 +3초 추가
  - 테스트: 시간이 정확하게 추가되는지 확인
  - 커밋: `feat(game): add time bonus mechanic`

- [ ] **5.1.9** 멀티플라이어 처리
  - 10초간 모든 점수 2배
  - 테스트: 멀티플라이어 효과 확인
  - 커밋: `feat(game): add multiplier powerup`

#### 5.2 콤보 시스템 [P1]

- [ ] **5.2.1** ComboSystem 클래스

  - src/game/ComboSystem.ts 생성
  - combo 카운터
  - comboTimer (3초)
  - 테스트: 콤보 증가와 타이머 동작 확인
  - 커밋: `feat(game): create combo system`

- [ ] **5.2.2** 콤보 증가 로직

  - 성공 시 combo++
  - 실패 시 combo 리셋
  - maxCombo 업데이트
  - 테스트: 콤보가 정확하게 계산되는지 확인
  - 커밋: `feat(game): implement combo increment logic`

- [ ] **5.2.3** 콤보 타이머

  - 3초 이내에 다음 캐치 필요
  - 타이머 초과 시 리셋
  - 테스트: 타이머가 정확하게 동작하는지 확인
  - 커밋: `feat(game): add combo timer mechanics`

- [ ] **5.2.4** 콤보 티어 시스템

  - 3, 5, 10, 15, 20 연속 티어
  - 각 티어별 보너스 점수
  - 테스트: 티어별 보너스가 정확한지 확인
  - 커밋: `feat(game): implement combo tier system`

- [ ] **5.2.5** ComboDisplay 컴포넌트

  - src/components/UI/ComboDisplay.tsx 생성
  - "NICE!", "GREAT!" 등 메시지 표시
  - 애니메이션 효과
  - 테스트: 콤보 메시지가 정확하게 표시되는지 확인
  - 커밋: `feat(ui): create combo display component`

- [ ] **5.2.6** 콤보 타이머 바 UI
  - StatusBar에 타이머 바 추가
  - 시각적 카운트다운
  - 테스트: 타이머 바가 정확하게 표시되는지 확인
  - 커밋: `feat(ui): add combo timer bar`

#### 5.3 등급 시스템 [P1]

- [ ] **5.3.1** Grade enum 정의

  - Bronze, Silver, Gold, Diamond, Master
  - types/game.types.ts에 추가
  - 테스트: 타입 정의 확인
  - 커밋: `feat(types): add grade types`

- [ ] **5.3.2** 등급 판정 로직

  - LevelManager에 calculateGrade() 메서드
  - 조건별 등급 판정
  - 테스트: 각 조건에 맞는 등급이 부여되는지 확인
  - 커밋: `feat(game): implement grade calculation`

- [ ] **5.3.3** 등급별 보상

  - 보너스 점수 지급
  - 파워업 지급
  - 테스트: 보상이 정확하게 지급되는지 확인
  - 커밋: `feat(game): add grade-based rewards`

- [ ] **5.3.4** LevelTransition에 등급 표시
  - 등급 아이콘 표시
  - 애니메이션 효과
  - 테스트: 등급이 정확하게 표시되는지 확인
  - 커밋: `feat(ui): display grade in level transition`

---

### Week 6: 비주얼 이펙트

#### 6.1 파티클 시스템 [P1]

- [ ] **6.1.1** Particle 클래스

  - src/core/entities/Particle.ts 생성
  - 속성: position, velocity, color, lifetime, size
  - update() 메서드
  - 테스트: 파티클 인스턴스 생성 및 업데이트 확인
  - 커밋: `feat(entity): create particle class`

- [ ] **6.1.2** ParticleSystem 클래스

  - src/core/ParticleSystem.ts 생성
  - 오브젝트 풀링 (500개 풀)
  - emit() 메서드
  - 테스트: 파티클 생성 및 풀링 확인
  - 커밋: `feat(core): create particle system with object pooling`

- [ ] **6.1.3** 파티클 렌더링

  - Canvas에 파티클 렌더링
  - 알파값 적용 (페이드 아웃)
  - 테스트: 파티클이 정확하게 렌더링되는지 확인
  - 커밋: `feat(render): implement particle rendering`

- [ ] **6.1.4** 성공 파티클 효과

  - 캐치 성공 시 초록 파티클
  - 콤보 티어별 색상 변화
  - 테스트: 성공 파티클이 표시되는지 확인
  - 커밋: `feat(effect): add success particle effects`

- [ ] **6.1.5** 폭발 파티클 효과

  - 폭탄 충돌 시 붉은 파티클
  - 사방으로 퍼지는 효과
  - 테스트: 폭발 파티클이 표시되는지 확인
  - 커밋: `feat(effect): add explosion particle effects`

- [ ] **6.1.6** 특수 파티클 효과
  - 골든 스타: 황금 트레일
  - 다이아몬드: 반짝임
  - 레인보우: 무지개 효과
  - 테스트: 각 특수 파티클이 표시되는지 확인
  - 커밋: `feat(effect): add special shape particle effects`

#### 6.2 화면 효과 [P1]

- [ ] **6.2.1** CameraController 클래스

  - src/core/CameraController.ts 생성
  - shake() 메서드
  - offset 관리
  - 테스트: 카메라 쉐이크가 동작하는지 확인
  - 커밋: `feat(core): create camera controller with shake effect`

- [ ] **6.2.2** 카메라 쉐이크 구현

  - 폭탄 충돌 시 0.3초간 5px 진폭
  - 감쇠 효과
  - 테스트: 쉐이크가 자연스럽게 동작하는지 확인
  - 커밋: `feat(effect): implement camera shake on bomb collision`

- [ ] **6.2.3** 슬로우 모션 효과

  - 15+ 콤보 시 0.5x 속도
  - 시간 스케일 조정
  - 1초간 지속
  - 테스트: 슬로우 모션이 정확하게 적용되는지 확인
  - 커밋: `feat(effect): add slow motion effect for high combos`

- [ ] **6.2.4** 화면 테두리 빛남 효과

  - 10+ 콤보 시 테두리 강조
  - 맥동 애니메이션
  - CSS 애니메이션 사용
  - 테스트: 테두리 효과가 표시되는지 확인
  - 커밋: `feat(effect): add screen border glow effect`

- [ ] **6.2.5** 배경 동적 변화
  - 콤보에 따라 배경 색상 강조
  - 부드러운 트랜지션
  - 테스트: 배경 변화가 자연스러운지 확인
  - 커밋: `feat(effect): add dynamic background color change`

#### 6.3 애니메이션 [P1]

- [ ] **6.3.1** 도형 회전 애니메이션

  - 떨어지면서 360도 회전
  - rotation 속성 업데이트
  - 테스트: 도형이 회전하면서 떨어지는지 확인
  - 커밋: `feat(animation): add shape rotation animation`

- [ ] **6.3.2** 캐처 바운스 애니메이션

  - 캐치 성공 시 살짝 튕김
  - GSAP 사용
  - 테스트: 바운스 애니메이션이 동작하는지 확인
  - 커밋: `feat(animation): add catcher bounce on catch`

- [ ] **6.3.3** UI 트랜지션 애니메이션

  - Framer Motion으로 모든 UI 요소 애니메이션
  - Fade, Slide 효과
  - 테스트: UI 전환이 부드러운지 확인
  - 커밋: `feat(animation): add smooth UI transitions`

- [ ] **6.3.4** 레벨 전환 애니메이션
  - 와이프 효과
  - 테마 색상 변화
  - 테스트: 레벨 전환 애니메이션 확인
  - 커밋: `feat(animation): add level transition wipe effect`

#### 6.4 ScorePopup 컴포넌트 [P1]

- [ ] **6.4.1** ScorePopup 컴포넌트 생성

  - src/components/UI/ScorePopup.tsx 생성
  - 점수 획득 시 팝업 표시
  - 위로 올라가며 페이드 아웃
  - 테스트: 점수 팝업이 표시되는지 확인
  - 커밋: `feat(ui): create score popup component`

- [ ] **6.4.2** 특수 도형 점수 표시
  - 배율 표시 (x2, x1.5, x3)
  - 색상 구분
  - 테스트: 특수 점수가 정확하게 표시되는지 확인
  - 커밋: `feat(ui): add special score multiplier display`

---

### Week 7: 사운드 & 테마

#### 7.1 오디오 시스템 [P1]

- [ ] **7.1.1** AudioService 클래스

  - src/services/AudioService.ts 생성
  - Howler.js 래핑
  - 싱글톤 패턴
  - 테스트: 오디오 재생 확인
  - 커밋: `feat(audio): create audio service with howler.js`

- [ ] **7.1.2** 효과음 로딩

  - public/assets/audio/sfx/ 폴더에 임시 사운드 파일
  - audioConfig.ts에 사운드 경로 정의
  - preloadSFX() 메서드
  - 테스트: 효과음이 로드되는지 확인
  - 커밋: `feat(audio): implement sfx preloading`

- [ ] **7.1.3** BGM 로딩

  - public/assets/audio/bgm/ 폴더에 임시 음악 파일
  - audioConfig.ts에 BGM 경로 정의
  - preloadBGM() 메서드
  - 테스트: BGM이 로드되는지 확인
  - 커밋: `feat(audio): implement bgm preloading`

- [ ] **7.1.4** 효과음 재생

  - playSFX(name) 메서드
  - 볼륨 제어
  - 중첩 재생 지원
  - 테스트: 효과음이 정확하게 재생되는지 확인
  - 커밋: `feat(audio): add sfx playback functionality`

- [ ] **7.1.5** BGM 재생 및 제어

  - playBGM(name) 메서드
  - 루프 재생
  - 크로스페이드 (2초)
  - 테스트: BGM이 루프되고 크로스페이드되는지 확인
  - 커밋: `feat(audio): add bgm playback with crossfade`

- [ ] **7.1.6** 볼륨 제어
  - setMusicVolume(), setSFXVolume() 메서드
  - settingsStore와 연동
  - 테스트: 볼륨 조절이 정상 동작하는지 확인
  - 커밋: `feat(audio): implement volume controls`

#### 7.2 사운드 통합 [P1]

- [ ] **7.2.1** 게임 액션별 효과음

  - 도형 변경: tick.mp3
  - 색상 변경: whoosh.mp3
  - 캐치 성공: ding.mp3
  - 캐치 실패: miss.mp3
  - 테스트: 각 액션에 효과음이 재생되는지 확인
  - 커밋: `feat(audio): integrate sfx for game actions`

- [ ] **7.2.2** 콤보 효과음

  - 콤보 3/5: combo_nice.mp3
  - 콤보 10: combo_amazing.mp3
  - 콤보 15/20: combo_legendary.mp3
  - 테스트: 콤보별 효과음이 재생되는지 확인
  - 커밋: `feat(audio): add combo sound effects`

- [ ] **7.2.3** 특수 도형 효과음

  - 폭탄 폭발: bomb_explosion.mp3
  - 파워업 획득: powerup_get.mp3
  - 파워업 사용: powerup_use.mp3
  - 테스트: 특수 도형 효과음이 재생되는지 확인
  - 커밋: `feat(audio): add special shape sound effects`

- [ ] **7.2.4** 레벨 효과음
  - 레벨업: level_up.mp3
  - 게임 오버: game_over.mp3
  - 테스트: 레벨 관련 효과음이 재생되는지 확인
  - 커밋: `feat(audio): add level-related sound effects`

#### 7.3 동적 음악 시스템 [P1]

- [ ] **7.3.1** 레벨별 BGM 전환

  - LevelManager에서 레벨 변경 시 BGM 전환
  - 크로스페이드 적용
  - 테스트: 레벨별로 BGM이 전환되는지 확인
  - 커밋: `feat(audio): implement level-based bgm switching`

- [ ] **7.3.2** 레이어 시스템 (선택적)

  - 콤보에 따라 악기 레이어 추가
  - Howler.js 다중 트랙 관리
  - 테스트: 콤보에 따라 음악이 풍성해지는지 확인
  - 커밋: `feat(audio): add dynamic music layer system`

- [ ] **7.3.3** 긴장감 조성
  - 생명 1개일 때 템포 증가 효과
  - 로우패스 필터 적용 (Web Audio API)
  - 테스트: 생명 1개일 때 음악이 변화하는지 확인
  - 커밋: `feat(audio): add tension music effect for low lives`

#### 7.4 레벨 테마 구현 [P1]

- [ ] **7.4.1** 테마 적용 시스템

  - LevelManager에서 현재 테마 정보 제공
  - 배경색, 파티클 색상 동적 적용
  - 테스트: 레벨별로 테마가 적용되는지 확인
  - 커밋: `feat(theme): implement dynamic theme application`

- [ ] **7.4.2** 배경 그라디언트

  - CSS gradient를 Canvas에 적용
  - 레벨별 고유한 색상 조합
  - 테스트: 배경이 아름답게 표시되는지 확인
  - 커밋: `feat(theme): add level-specific background gradients`

- [ ] **7.4.3** 배경 애니메이션

  - 물결, 화염, 별자리 등 애니메이션
  - 성능 최적화 (requestAnimationFrame)
  - 테스트: 배경 애니메이션이 부드럽게 동작하는지 확인
  - 커밋: `feat(theme): add animated backgrounds for levels`

- [ ] **7.4.4** 파티클 색상 동적 적용
  - 테마에 맞는 파티클 색상
  - 레벨 전환 시 색상 변경
  - 테스트: 파티클 색상이 테마에 맞게 변경되는지 확인
  - 커밋: `feat(theme): apply theme colors to particles`

---

## Phase 3: 파워업 & 진행 시스템 (2주)

### Week 8: 파워업

#### 8.1 파워업 시스템 [P1]

- [ ] **8.1.1** PowerUp 타입 정의

  - src/types/powerup.types.ts 생성
  - PowerUpType enum (SlowTime, AutoMatch, DoubleScore, Shield, StarShower)
  - PowerUp 인터페이스
  - 테스트: 타입 정의 확인
  - 커밋: `feat(types): define powerup types`

- [ ] **8.1.2** PowerUpConfig 작성

  - src/config/powerUpConfig.ts 생성
  - 각 파워업의 이름, 설명, 아이콘, 지속시간
  - 테스트: 설정 데이터 확인
  - 커밋: `feat(config): add powerup configurations`

- [ ] **8.1.3** PowerUpManager 클래스

  - src/game/PowerUpManager.ts 생성
  - activePowerUps 배열 관리
  - activatePowerUp(), deactivatePowerUp() 메서드
  - 테스트: 파워업 활성화/비활성화 확인
  - 커밋: `feat(game): create powerup manager`

- [ ] **8.1.4** 파워업 인벤토리
  - gameStore에 powerUpInventory 추가
  - 파워업 획득 시 인벤토리에 추가
  - 테스트: 인벤토리가 정확하게 업데이트되는지 확인
  - 커밋: `feat(store): add powerup inventory state`

#### 8.2 개별 파워업 구현 [P1]

- [ ] **8.2.1** 슬로우 타임 파워업

  - 낙하 속도 50% 감소
  - 5초 지속
  - 시간 스케일 조정
  - 테스트: 슬로우 타임이 정확하게 동작하는지 확인
  - 커밋: `feat(powerup): implement slow time powerup`

- [ ] **8.2.2** 오토 매치 파워업

  - 다음 3개 도형 자동 매칭
  - 카운트 기반 (3회)
  - 자동으로 캐처 형태/색상 변경
  - 테스트: 오토 매치가 정확하게 동작하는지 확인
  - 커밋: `feat(powerup): implement auto match powerup`

- [ ] **8.2.3** 더블 스코어 파워업

  - 모든 점수 2배
  - 10초 지속
  - ScoreCalculator에 배율 적용
  - 테스트: 더블 스코어가 정확하게 적용되는지 확인
  - 커밋: `feat(powerup): implement double score powerup`

- [ ] **8.2.4** 쉴드 파워업

  - 1회 실수 무효화
  - 폭탄 방어 가능
  - 시각적 쉴드 표시
  - 테스트: 쉴드가 정확하게 동작하는지 확인
  - 커밋: `feat(powerup): implement shield powerup`

- [ ] **8.2.5** 스타 쇼워 파워업
  - 5초간 모든 도형이 다이아몬드로 변경
  - ShapeManager에 효과 적용
  - 테스트: 스타 쇼워가 정확하게 동작하는지 확인
  - 커밋: `feat(powerup): implement star shower powerup`

#### 8.3 파워업 UI [P1]

- [ ] **8.3.1** PowerUpBar 컴포넌트

  - src/components/Game/PowerUpBar.tsx 생성
  - 인벤토리 파워업 표시
  - 아이콘과 수량 표시
  - 테스트: 파워업 인벤토리가 정확하게 표시되는지 확인
  - 커밋: `feat(ui): create powerup bar component`

- [ ] **8.3.2** 파워업 활성화 UI

  - 클릭/터치로 파워업 사용
  - 활성화된 파워업 강조 표시
  - 남은 시간/카운트 표시
  - 테스트: 파워업 사용 UI가 정상 동작하는지 확인
  - 커밋: `feat(ui): add powerup activation interface`

- [ ] **8.3.3** 파워업 효과 애니메이션
  - 활성화 시 시각적 효과
  - 아이콘 펄스 애니메이션
  - 테스트: 애니메이션이 부드럽게 동작하는지 확인
  - 커밋: `feat(animation): add powerup activation animations`

#### 8.4 골든 스타 드롭 시스템 [P1]

- [ ] **8.4.1** 골든 스타 캐치 시 파워업 드롭

  - 랜덤 파워업 1개 지급
  - 인벤토리에 추가
  - 테스트: 골든 스타 캐치 시 파워업이 지급되는지 확인
  - 커밋: `feat(game): add powerup drop on golden star catch`

- [ ] **8.4.2** 파워업 드롭 애니메이션
  - 파워업 아이콘 팝업
  - 인벤토리로 날아가는 효과
  - 테스트: 드롭 애니메이션이 표시되는지 확인
  - 커밋: `feat(animation): add powerup drop animation`

---

### Week 9: 진행 시스템

#### 9.1 업적 시스템 [P2]

- [ ] **9.1.1** Achievement 타입 정의

  - src/types/achievement.types.ts 생성
  - Achievement 인터페이스 (id, name, description, condition, reward)
  - 테스트: 타입 정의 확인
  - 커밋: `feat(types): define achievement types`

- [ ] **9.1.2** achievementConfig.ts 작성

  - src/config/achievementConfig.ts 생성
  - 10개 이상의 업적 정의
  - 예: "첫 승리", "콤보 마스터", "완벽주의자" 등
  - 테스트: 설정 데이터 확인
  - 커밋: `feat(config): add achievement configurations`

- [ ] **9.1.3** AchievementManager 클래스

  - src/game/AchievementManager.ts 생성
  - checkAchievements() 메서드
  - unlockAchievement() 메서드
  - 테스트: 업적 체크 및 언락 확인
  - 커밋: `feat(game): create achievement manager`

- [ ] **9.1.4** 업적 상태 관리

  - persistStore에 achievements 추가
  - 언락된 업적 저장
  - 테스트: 업적이 영구 저장되는지 확인
  - 커밋: `feat(store): add achievement state persistence`

- [ ] **9.1.5** 업적 알림

  - 업적 달성 시 팝업 표시
  - 애니메이션 효과
  - 테스트: 업적 알림이 표시되는지 확인
  - 커밋: `feat(ui): add achievement unlock notification`

- [ ] **9.1.6** Achievements 컴포넌트
  - src/components/Menu/Achievements.tsx 생성
  - 모든 업적 목록 표시
  - 달성/미달성 상태 표시
  - 테스트: 업적 목록이 정확하게 표시되는지 확인
  - 커밋: `feat(ui): create achievements menu component`

#### 9.2 통계 추적 [P2]

- [ ] **9.2.1** 통계 데이터 구조

  - persistStore에 stats 섹션 추가
  - totalCatches, totalMisses, bestCombo 등
  - 테스트: 통계 데이터 확인
  - 커밋: `feat(store): add statistics tracking`

- [ ] **9.2.2** 통계 업데이트

  - 게임 진행 중 실시간 통계 업데이트
  - 각 액션 후 자동 저장
  - 테스트: 통계가 정확하게 업데이트되는지 확인
  - 커밋: `feat(game): implement real-time statistics update`

- [ ] **9.2.3** 통계 화면
  - GameOverScreen에 통계 섹션 추가
  - 총 플레이 시간, 캐치율 등 표시
  - 테스트: 통계가 정확하게 표시되는지 확인
  - 커밋: `feat(ui): add statistics display to game over screen`

#### 9.3 영구 데이터 저장 [P2]

- [ ] **9.3.1** StorageService 클래스

  - src/services/StorageService.ts 생성
  - 메모리 기반 저장소 (Map 사용)
  - save(), load(), clear() 메서드
  - 테스트: 데이터 저장 및 로드 확인
  - 커밋: `feat(storage): create memory-based storage service`

- [ ] **9.3.2** persistStore 연동

  - StorageService를 사용하여 데이터 영구화
  - 게임 시작 시 로드
  - 상태 변경 시 자동 저장
  - 테스트: 페이지 새로고침 후 데이터 유지 확인
  - 커밋: `feat(store): integrate storage service with persist store`

- [ ] **9.3.3** 데이터 마이그레이션
  - 버전 관리
  - 구 버전 데이터 호환성
  - 테스트: 다양한 버전의 데이터 로드 확인
  - 커밋: `feat(storage): add data migration support`

#### 9.4 설정 메뉴 [P2]

- [ ] **9.4.1** Settings 컴포넌트

  - src/components/Menu/Settings.tsx 생성
  - 음악 볼륨 슬라이더
  - 효과음 볼륨 슬라이더
  - 난이도 선택
  - 테스트: 설정 메뉴가 표시되는지 확인
  - 커밋: `feat(ui): create settings menu component`

- [ ] **9.4.2** 설정 상태 관리

  - settingsStore 생성
  - 설정 변경 시 즉시 적용
  - 테스트: 설정이 정확하게 적용되는지 확인
  - 커밋: `feat(store): create settings store`

- [ ] **9.4.3** 설정 영구 저장

  - persistStore에 settings 추가
  - 게임 재시작 시 설정 유지
  - 테스트: 설정이 영구 저장되는지 확인
  - 커밋: `feat(storage): persist settings data`

- [ ] **9.4.4** 접근성 옵션
  - 색맹 모드 ON/OFF
  - 애니메이션 감소 옵션
  - 테스트: 접근성 옵션이 동작하는지 확인
  - 커밋: `feat(accessibility): add accessibility options to settings`

---

## Phase 4: 추가 모드 & 소셜 (2주)

### Week 10: 게임 모드

#### 10.1 게임 모드 시스템 [P2]

- [ ] **10.1.1** GameMode enum 정의

  - Classic, TimeAttack, Endless, DailyChallenge
  - types/game.types.ts에 추가
  - 테스트: 타입 정의 확인
  - 커밋: `feat(types): add game mode types`

- [ ] **10.1.2** 모드 선택 UI

  - MainMenu에 모드 선택 버튼 추가
  - 각 모드 설명 표시
  - 테스트: 모드 선택 UI가 표시되는지 확인
  - 커밋: `feat(ui): add game mode selection to main menu`

- [ ] **10.1.3** gameStore에 모드 관리
  - currentMode 상태 추가
  - 모드별 초기화 로직
  - 테스트: 모드가 정확하게 설정되는지 확인
  - 커밋: `feat(store): add game mode state management`

#### 10.2 타임 어택 모드 [P2]

- [ ] **10.2.1** 타임 어택 규칙 구현

  - 제한 시간 내 최대한 많은 점수
  - 타이머 카운트다운 (60초)
  - 시간 종료 시 게임 오버
  - 테스트: 타임 어택이 정확하게 동작하는지 확인
  - 커밋: `feat(mode): implement time attack mode`

- [ ] **10.2.2** 타임 어택 UI
  - 큰 타이머 표시
  - 남은 시간 경고 (10초 이하)
  - 테스트: 타이머 UI가 정확하게 표시되는지 확인
  - 커밋: `feat(ui): add time attack timer display`

#### 10.3 엔드리스 모드 [P2]

- [ ] **10.3.1** 엔드리스 규칙 구현

  - 무한 레벨
  - 난이도 지속 증가
  - 생명 시스템 유지
  - 테스트: 엔드리스 모드가 정상 동작하는지 확인
  - 커밋: `feat(mode): implement endless mode`

- [ ] **10.3.2** 엔드리스 난이도 증가
  - 점진적 속도 증가
  - 특수 도형 확률 증가
  - 테스트: 난이도가 적절하게 증가하는지 확인
  - 커밋: `feat(mode): add progressive difficulty in endless mode`

#### 10.4 데일리 챌린지 [P2]

- [ ] **10.4.1** 데일리 챌린지 생성

  - 날짜 기반 시드 생성
  - 고정된 도형 순서 (시드 기반 랜덤)
  - 테스트: 같은 날짜에 동일한 챌린지가 생성되는지 확인
  - 커밋: `feat(mode): implement daily challenge generation`

- [ ] **10.4.2** 데일리 챌린지 UI

  - 챌린지 날짜 표시
  - "오늘의 챌린지" 타이틀
  - 테스트: 챌린지 UI가 표시되는지 확인
  - 커밋: `feat(ui): add daily challenge interface`

- [ ] **10.4.3** 데일리 챌린지 기록
  - 날짜별 최고 점수 저장
  - 하루에 한 번만 기록 갱신
  - 테스트: 기록이 정확하게 저장되는지 확인
  - 커밋: `feat(storage): add daily challenge score tracking`

#### 10.5 난이도 설정 [P2]

- [ ] **10.5.1** DifficultyLevel enum

  - Easy, Normal, Hard
  - types/game.types.ts에 추가
  - 테스트: 타입 정의 확인
  - 커밋: `feat(types): add difficulty level types`

- [ ] **10.5.2** 난이도별 설정 적용

  - Easy: 낙하 속도 -20%, 생성 간격 +0.5초
  - Normal: 기본 설정
  - Hard: 낙하 속도 +20%, 폭탄 확률 +5%
  - 테스트: 난이도별 설정이 정확하게 적용되는지 확인
  - 커밋: `feat(game): apply difficulty level adjustments`

- [ ] **10.5.3** 난이도 선택 UI
  - Settings 또는 MainMenu에서 선택
  - 난이도별 설명 표시
  - 테스트: 난이도 선택이 정상 동작하는지 확인
  - 커밋: `feat(ui): add difficulty selection interface`

---

### Week 11: 소셜 & 커스터마이징

#### 11.1 리더보드 [P2]

- [ ] **11.1.1** 로컬 리더보드 데이터

  - persistStore에 leaderboard 추가
  - 상위 10개 점수 저장
  - 테스트: 리더보드 데이터 확인
  - 커밋: `feat(storage): add local leaderboard data`

- [ ] **11.1.2** Leaderboard 컴포넌트

  - src/components/Menu/Leaderboard.tsx 생성
  - 순위, 점수, 레벨 표시
  - 모드별 리더보드 분리
  - 테스트: 리더보드가 정확하게 표시되는지 확인
  - 커밋: `feat(ui): create leaderboard component`

- [ ] **11.1.3** 리더보드 업데이트
  - 게임 종료 시 점수 비교
  - 상위 10개에 포함되면 저장
  - 테스트: 리더보드가 정확하게 업데이트되는지 확인
  - 커밋: `feat(game): update leaderboard on game end`

#### 11.2 점수 공유 [P2]

- [ ] **11.2.1** 공유 이미지 생성

  - Canvas로 점수 카드 렌더링
  - 게임 통계 포함
  - toDataURL()로 이미지 변환
  - 테스트: 공유 이미지가 생성되는지 확인
  - 커밋: `feat(share): generate shareable score image`

- [ ] **11.2.2** Web Share API 통합

  - navigator.share() 사용
  - 폴백: 이미지 다운로드
  - 테스트: 공유 기능이 동작하는지 확인
  - 커밋: `feat(share): integrate web share api`

- [ ] **11.2.3** 공유 버튼 UI
  - GameOverScreen에 공유 버튼 추가
  - 아이콘과 텍스트
  - 테스트: 공유 버튼이 표시되고 동작하는지 확인
  - 커밋: `feat(ui): add share button to game over screen`

#### 11.3 캐처 스킨 시스템 [P2]

- [ ] **11.3.1** Skin 타입 정의

  - src/types/skin.types.ts 생성
  - Skin 인터페이스 (id, name, renderFunction)
  - 테스트: 타입 정의 확인
  - 커밋: `feat(types): define skin types`

- [ ] **11.3.2** 기본 스킨 5종 구현

  - Classic, Neon, Wooden, Metal, Rainbow
  - 각 스킨의 렌더링 함수
  - 테스트: 각 스킨이 정확하게 렌더링되는지 확인
  - 커밋: `feat(skin): implement 5 catcher skins`

- [ ] **11.3.3** 스킨 선택 UI

  - Settings에 스킨 선택 추가
  - 스킨 미리보기
  - 테스트: 스킨 선택이 정상 동작하는지 확인
  - 커밋: `feat(ui): add skin selection interface`

- [ ] **11.3.4** 스킨 언락 시스템
  - 특정 조건 달성 시 스킨 언락
  - persistStore에 unlockedSkins 저장
  - 테스트: 스킨 언락이 정상 동작하는지 확인
  - 커밋: `feat(game): implement skin unlock system`

#### 11.4 배경 테마 [P2]

- [ ] **11.4.1** Theme 타입 정의

  - src/types/theme.types.ts 생성
  - Theme 인터페이스 (id, name, colors, animation)
  - 테스트: 타입 정의 확인
  - 커밋: `feat(types): define background theme types`

- [ ] **11.4.2** 배경 테마 6종 구현

  - 각 레벨 범위별 테마
  - 테마별 고유한 색상과 애니메이션
  - 테스트: 각 테마가 정확하게 렌더링되는지 확인
  - 커밋: `feat(theme): implement 6 background themes`

- [ ] **11.4.3** 테마 선택 UI

  - Settings에 테마 선택 추가
  - 테마 미리보기
  - 테스트: 테마 선택이 정상 동작하는지 확인
  - 커밋: `feat(ui): add theme selection interface`

- [ ] **11.4.4** 테마 언락 시스템
  - 해당 레벨 클리어 시 테마 언락
  - persistStore에 unlockedThemes 저장
  - 테스트: 테마 언락이 정상 동작하는지 확인
  - 커밋: `feat(game): implement theme unlock system`

---

## Phase 5: 튜토리얼 & 폴리싱 (1주)

### Week 12: 마무리

#### 12.1 튜토리얼 [P1]

- [ ] **12.1.1** TutorialStep 컴포넌트

  - src/components/Tutorial/TutorialStep.tsx 생성
  - 단계별 가이드 표시
  - 다음/이전 버튼
  - 테스트: 튜토리얼 단계가 표시되는지 확인
  - 커밋: `feat(tutorial): create tutorial step component`

- [ ] **12.1.2** 튜토리얼 단계 정의

  - 1단계: 캐처 이동
  - 2단계: 도형 변경
  - 3단계: 색상 변경
  - 4단계: 도형 캐치
  - 5단계: 콤보 만들기
  - 테스트: 모든 단계가 정확하게 표시되는지 확인
  - 커밋: `feat(tutorial): define tutorial steps`

- [ ] **12.1.3** TutorialOverlay 컴포넌트

  - src/components/Tutorial/TutorialOverlay.tsx 생성
  - 반투명 오버레이
  - 강조 영역 (spotlight)
  - 테스트: 오버레이가 표시되는지 확인
  - 커밋: `feat(tutorial): create tutorial overlay with spotlight`

- [ ] **12.1.4** 튜토리얼 진행 로직

  - gameStore에 tutorialStep 추가
  - 조건 달성 시 다음 단계
  - 건너뛰기 옵션
  - 테스트: 튜토리얼이 정상 진행되는지 확인
  - 커밋: `feat(tutorial): implement tutorial progression logic`

- [ ] **12.1.5** 첫 플레이 감지
  - persistStore에 hasPlayedBefore 추가
  - 첫 플레이 시 자동으로 튜토리얼 시작
  - 테스트: 첫 플레이 시 튜토리얼이 시작되는지 확인
  - 커밋: `feat(tutorial): auto-start tutorial for first-time players`

#### 12.2 힌트 시스템 [P2]

- [ ] **12.2.1** HintSystem 컴포넌트

  - src/components/Tutorial/HintSystem.tsx 생성
  - 상황별 힌트 표시
  - 자동으로 사라짐 (3초 후)
  - 테스트: 힌트가 표시되는지 확인
  - 커밋: `feat(hint): create hint system component`

- [ ] **12.2.2** 상황별 힌트 로직
  - 연속 실패 시: "도형과 색상을 확인하세요"
  - 콤보 중단 시: "빠르게 캐치하여 콤보를 유지하세요"
  - 파워업 미사용 시: "파워업을 사용해보세요"
  - 테스트: 힌트가 적절한 상황에 표시되는지 확인
  - 커밋: `feat(hint): add context-aware hint triggers`

#### 12.3 성능 최적화 [P1]

- [ ] **12.3.1** 렌더링 최적화

  - React.memo 적용
  - useMemo, useCallback 사용
  - 불필요한 리렌더링 제거
  - 테스트: React DevTools Profiler로 확인
  - 커밋: `perf(react): optimize component rendering`

- [ ] **12.3.2** Canvas 최적화

  - Dirty Rectangle 구현
  - 레이어 분리 (정적/동적)
  - 오프스크린 캔버스 활용
  - 테스트: 60fps 유지 확인
  - 커밋: `perf(canvas): optimize canvas rendering performance`

- [ ] **12.3.3** 번들 크기 최적화

  - Code Splitting 적용
  - Tree Shaking 확인
  - 불필요한 의존성 제거
  - 테스트: Bundle Analyzer로 확인
  - 커밋: `perf(build): optimize bundle size`

- [ ] **12.3.4** 에셋 최적화
  - 이미지 압축 (WebP)
  - 오디오 압축 (MP3 128kbps)
  - 지연 로딩 적용
  - 테스트: 로딩 시간 확인
  - 커밋: `perf(assets): optimize asset loading`

#### 12.4 접근성 개선 [P2]

- [ ] **12.4.1** 색맹 모드 구현

  - 도형에 패턴 추가 (줄무늬, 점무늬 등)
  - 색상별 고유 패턴
  - Settings에서 ON/OFF
  - 테스트: 색맹 모드가 정상 동작하는지 확인
  - 커밋: `feat(accessibility): implement colorblind mode`

- [ ] **12.4.2** ARIA 레이블 추가

  - 모든 버튼에 aria-label
  - 게임 상태 aria-live로 알림
  - 테스트: 화면 낭독기로 확인
  - 커밋: `feat(accessibility): add aria labels and live regions`

- [ ] **12.4.3** 키보드 네비게이션 개선

  - 모든 UI 요소 Tab으로 접근 가능
  - Focus 스타일 명확화
  - 테스트: 키보드만으로 전체 플레이 확인
  - 커밋: `feat(accessibility): improve keyboard navigation`

- [ ] **12.4.4** 명도 대비 검증
  - WCAG AA 기준 (4.5:1) 충족
  - 색상 조합 검토
  - 테스트: Lighthouse Accessibility 점수 확인
  - 커밋: `fix(accessibility): ensure wcag aa contrast compliance`

#### 12.5 전체 QA [P0]

- [ ] **12.5.1** 기능 테스트 (전체 체크리스트)

  - 모든 게임 모드 동작 확인
  - 모든 파워업 동작 확인
  - 레벨 1-20 진행 확인
  - 특수 도형 모두 확인
  - 업적 시스템 확인
  - 리더보드 확인
  - 커밋: `test(qa): complete comprehensive feature testing`

- [ ] **12.5.2** 크로스 브라우저 테스트

  - Chrome, Firefox, Safari, Edge
  - 모바일: iOS Safari, Android Chrome
  - 태블릿
  - 커밋: `test(qa): verify cross-browser compatibility`

- [ ] **12.5.3** 성능 테스트

  - Lighthouse 점수 (Performance 90+)
  - 60fps 유지 (데스크톱)
  - 30fps 유지 (모바일)
  - 메모리 누수 확인
  - 커밋: `test(qa): validate performance benchmarks`

- [ ] **12.5.4** 접근성 테스트

  - Lighthouse Accessibility 점수 (90+)
  - 화면 낭독기 테스트
  - 키보드 전용 플레이
  - 색맹 모드 테스트
  - 커밋: `test(qa): complete accessibility testing`

- [ ] **12.5.5** 버그 수정
  - 발견된 모든 P0/P1 버그 수정
  - 회귀 테스트
  - 커밋: `fix(bugs): resolve all critical and high priority bugs`

#### 12.6 문서화 [P1]

- [ ] **12.6.1** README.md 작성

  - 프로젝트 소개
  - 빠른 시작 가이드
  - 빌드 및 배포 방법
  - 테스트: README 내용 검증
  - 커밋: `docs(readme): add comprehensive project documentation`

- [ ] **12.6.2** 코드 주석 추가

  - 복잡한 로직에 주석
  - JSDoc 스타일 함수 문서
  - 테스트: 주석 가독성 확인
  - 커밋: `docs(code): add comments and jsdoc annotations`

- [ ] **12.6.3** CHANGELOG.md 작성
  - 버전별 변경사항 정리
  - 테스트: CHANGELOG 내용 검증
  - 커밋: `docs(changelog): create version changelog`

---

## Phase 6: 출시 & 운영 (지속)

### 출시 전 준비 [P0]

- [ ] **출시.1** 베타 테스트

  - 20명 이상 베타 테스터 모집
  - 피드백 수집 및 반영
  - 커밋: `test(beta): incorporate beta tester feedback`

- [ ] **출시.2** 최종 빌드

  - 프로덕션 빌드 생성
  - 번들 크기 확인 (< 500KB gzip)
  - 테스트: 프로덕션 빌드 동작 확인
  - 커밋: `build(prod): create optimized production build`

- [ ] **출시.3** 배포

  - Vercel/Netlify에 배포
  - 도메인 연결
  - HTTPS 설정
  - 테스트: 배포된 사이트 동작 확인
  - 커밋: `deploy(prod): deploy to production environment`

- [ ] **출시.4** 모니터링 설정
  - 에러 추적 (Sentry 등)
  - 분석 도구 (Google Analytics 등)
  - 테스트: 모니터링 도구 동작 확인
  - 커밋: `feat(monitoring): setup error tracking and analytics`

---

## 테스트 전략

### 단위 테스트 (Vitest)

각 기능 구현 시 다음 패턴을 따름:

```bash
# 1. 기능 구현
# 2. 테스트 작성 (tests/unit/<name>.test.ts)
# 3. 테스트 실행
npm run test

# 4. 테스트 통과 확인
# 5. 테스트 파일 삭제 (임시 테스트인 경우)
# 6. git add . && git commit
```

### 통합 테스트

주요 기능 완성 시:

- 게임 플로우 테스트 (시작 → 플레이 → 종료)
- 파워업 시스템 테스트
- 레벨 진행 테스트

### E2E 테스트 (선택적)

출시 전:

- 전체 게임 플레이 시나리오
- 다양한 모드 테스트

---

## 커밋 컨벤션

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Type

- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드/설정 변경
- `perf`: 성능 개선

### Scope

- `setup`: 프로젝트 설정
- `core`: 게임 엔진
- `game`: 게임 로직
- `ui`: UI 컴포넌트
- `store`: 상태 관리
- `config`: 설정 파일
- `audio`: 오디오 시스템
- `animation`: 애니메이션
- `effect`: 비주얼 이펙트
- `theme`: 테마 시스템
- `powerup`: 파워업
- `mode`: 게임 모드
- `accessibility`: 접근성
- `tutorial`: 튜토리얼
- `storage`: 저장소
- `qa`: QA/테스트
- `deploy`: 배포

### 예시

```
feat(core): implement game loop with fps control

- Add GameLoop class with requestAnimationFrame
- Implement fixed time step at 60fps
- Add start/stop/pause/resume lifecycle methods

Closes #1
```

---

## 진행 상황 추적

### 현재 단계

- [ ] Phase 1 완료
- [ ] Phase 2 완료
- [ ] Phase 3 완료
- [ ] Phase 4 완료
- [ ] Phase 5 완료
- [ ] Phase 6 진행중

### 주요 마일스톤

- [ ] Milestone 1: 플레이 가능한 프로토타입 (Week 4)
- [ ] Milestone 2: 완성도 높은 게임플레이 (Week 7)
- [ ] Milestone 3: 깊이 있는 진행 시스템 (Week 9)
- [ ] Milestone 4: 다양한 플레이 경험 (Week 11)
- [ ] Milestone 5: 출시 준비 완료 (Week 12)

---

## 우선순위 가이드

- **P0 (Critical)**: 게임 플레이에 필수적인 기능, 즉시 구현 필요
- **P1 (High)**: 게임의 재미와 완성도에 중요한 기능
- **P2 (Medium)**: 있으면 좋은 기능, 추가 기능

---

## 참고사항

### 코드 품질 체크리스트

- [ ] TypeScript strict 모드 준수
- [ ] ESLint 경고 없음
- [ ] 모든 함수에 타입 정의
- [ ] 적절한 에러 핸들링
- [ ] 코드 중복 최소화
- [ ] 관심사 분리 (SoC)
- [ ] 단일 책임 원칙 (SRP)

### 성능 체크리스트

- [ ] 60fps 유지 (데스크톱)
- [ ] 30fps 유지 (모바일)
- [ ] 메모리 누수 없음
- [ ] 번들 크기 < 500KB (gzip)
- [ ] 초기 로딩 < 3초

### 접근성 체크리스트

- [ ] WCAG 2.1 Level AA 준수
- [ ] 키보드 네비게이션 가능
- [ ] 색맹 모드 지원
- [ ] 화면 낭독기 호환
- [ ] 명도 대비 4.5:1 이상

---

**Happy Coding! 🎮✨**
