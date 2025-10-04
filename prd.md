# 🎮 Shape Catcher Game - Technical PRD v3.0

> **Claude Code 최적화 개발 문서**  
> 모바일/데스크톱 크로스 플랫폼 아케이드 게임

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택 & 아키텍처](#2-기술-스택--아키텍처)
3. [핵심 게임 메카닉](#3-핵심-게임-메카닉)
4. [데이터 구조 설계](#4-데이터-구조-설계)
5. [게임 시스템 상세](#5-게임-시스템-상세)
6. [UI/UX 컴포넌트 구조](#6-uiux-컴포넌트-구조)
7. [파일 구조](#7-파일-구조)
8. [개발 우선순위 & 로드맵](#8-개발-우선순위--로드맵)
9. [성능 최적화 전략](#9-성능-최적화-전략)
10. [테스트 & QA](#10-테스트--qa)

---

## 1. 프로젝트 개요

### 1.1 제품 설명

떨어지는 도형을 반구형 캐처로 잡는 중독성 있는 레벨 기반 아케이드 게임

### 1.2 핵심 재미 요소

- ⚡ **순간 판단력**: 빠른 도형/색상 전환으로 긴장감 유지
- 🎯 **전략성**: 다음 도형 미리보기 + 파워업 타이밍 관리
- 🏆 **성취감**: 콤보, 등급, 업적 시스템으로 동기부여
- 🎨 **몰입감**: 동적 음악, 레벨별 테마, 화려한 비주얼 이펙트
- 🔄 **무한 재도전**: 다양한 게임 모드 (클래식, 타임어택, 엔드리스, 데일리)

### 1.3 기술 목표

- **타입 안정성**: TypeScript로 런타임 에러 최소화
- **고성능 렌더링**: Canvas 기반 60fps 유지
- **크로스 플랫폼**: 반응형 디자인 + 통합 입력 처리
- **상태 관리 최적화**: Zustand로 경량화
- **PWA 지원**: 오프라인 플레이 가능

---

## 2. 기술 스택 & 아키텍처

### 2.1 Core Technology Stack

| 카테고리             | 기술                 | 사유                                    |
| -------------------- | -------------------- | --------------------------------------- |
| **Framework**        | React 18+            | 컴포넌트 재사용성, 풍부한 생태계        |
| **Language**         | TypeScript 5+        | 타입 안정성, 개발자 경험 향상           |
| **State Management** | Zustand              | 경량, 간단한 API, 리렌더링 최적화       |
| **Rendering**        | HTML5 Canvas         | 고성능 2D 그래픽, 애니메이션            |
| **Styling**          | Tailwind CSS         | 빠른 UI 개발, 유틸리티 우선             |
| **Animation**        | Framer Motion + GSAP | 선언적 애니메이션, 복잡한 타임라인      |
| **Audio**            | Howler.js            | 크로스 브라우저 오디오, 스프라이트 지원 |
| **Build Tool**       | Vite                 | 빠른 HMR, 최적화된 번들링               |
| **Testing**          | Vitest + RTL         | 빠른 테스트, React 통합                 |
| **Deployment**       | Vercel/Netlify       | CI/CD, Edge Functions                   |

### 2.2 아키텍처 패턴

#### ECS (Entity Component System) 적용

- **Entity**: 게임 오브젝트 (도형, 캐처, 파티클)
- **Component**: 데이터만 보유 (위치, 속도, 렌더링 정보)
- **System**: 로직 처리 (이동, 충돌, 렌더링)

**장점**:

- 확장성: 새로운 기능 추가 용이
- 성능: 캐시 친화적, 배치 처리 가능
- 유지보수: 관심사 분리

#### 게임 루프 구조

```
Input → Update → Collision Detection → Physics → Render
  ↑                                                    ↓
  ←────────────── requestAnimationFrame ←──────────────
```

---

## 3. 핵심 게임 메카닉

### 3.1 도형 시스템

#### 기본 도형 (4종)

| 도형         | 타입       | 캐처 형태         | 특징             |
| ------------ | ---------- | ----------------- | ---------------- |
| 사각형 (■)   | `square`   | 평평한 반구 `╰─╯` | 가장 쉬움        |
| 역삼각형 (▽) | `triangle` | V자 홈 `╰▽╯`      | 정확한 위치 필요 |
| 별 (★)       | `star`     | 별 홈 `╰★╯`       | 중간 난이도      |
| 원 (●)       | `circle`   | 둥근 홈 `╰●╯`     | 중간 난이도      |

#### 특수 도형

| 도형                | 등장 레벨 | 특수 효과                            | 점수 배율 |
| ------------------- | --------- | ------------------------------------ | --------- |
| 💎 **다이아몬드**   | 6+        | 모든 캐처 형태 OK (색상만 맞추면 됨) | 2x        |
| 🌈 **레인보우**     | 11+       | 모든 색상 OK (도형만 맞추면 됨)      | 1.5x      |
| ⭐ **골든 스타**    | 16+       | 정확 매칭 필요, 파워업 드롭          | 3x        |
| 💣 **폭탄**         | 전체      | 받으면 -5점 + 1초 스턴               | 패널티    |
| ⏰ **타임 보너스**  | 8+        | 시간 +3초 추가                       | 보너스    |
| ✖️ **멀티플라이어** | 13+       | 10초간 모든 점수 2배                 | 버프      |

#### 도형 생성 규칙

- **순차 생성**: 한 번에 1개씩만 떨어짐
- **생성 타이밍**: 현재 도형이 캐치되거나 화면 밖으로 나간 후
- **랜덤 위치**: X축 랜덤 (좌우 20px 마진)
- **특수 도형 확률**: 레벨에 따라 증가 (5% → 25%)

### 3.2 캐처 시스템

#### 캐처 속성

- **위치**: X축 이동 가능, Y축 고정 (화면 하단 80px)
- **크기**: 80px × 40px
- **이동 속도**: 5px/frame (레벨에 따라 조정 가능)
- **상태**: 정상/스턴 (폭탄 맞았을 때)

#### 조작 방식

**데스크톱 (키보드)**

- `←` `→`: 좌우 이동 (누르고 있으면 연속 이동)
- `Space`: 도형 변경 (순환)
- `↑` `↓`: 색상 변경

**모바일 (터치)**

- **좌우 드래그**: 캐처 이동 (실시간 추적)
- **캐처 탭**: 도형 변경
- **상하 스와이프**: 색상 변경 (위→아래: 다음, 아래→위: 이전)

#### 입력 최적화

- **디바운싱**: 빠른 연속 입력 방지 (50ms)
- **제스처 임계값**: 스와이프 최소 30px
- **터치 영역**: 캐처 주변 50px 확장

### 3.3 충돌 & 매칭 시스템

#### 충돌 감지

- **AABB (Axis-Aligned Bounding Box)** 알고리즘 사용
- **감지 범위**: 도형 중심 기준 ±20px
- **프레임당 1회** 체크 (성능 최적화)

#### 매칭 규칙

| 도형 타입  | 매칭 조건                 | 결과                |
| ---------- | ------------------------- | ------------------- |
| 일반 도형  | 도형 + 색상 **모두** 일치 | 성공                |
| 다이아몬드 | 색상만 일치               | 성공 (2배)          |
| 레인보우   | 도형만 일치               | 성공 (1.5배)        |
| 골든 스타  | 도형 + 색상 정확 일치     | 성공 (3배) + 파워업 |
| 폭탄       | 충돌 시 무조건            | 실패 (패널티)       |

#### 실패 처리

- **불일치**: 도형이 바닥으로 떨어짐
- **폭탄 충돌**: -5점, 캐처 1초 스턴, 화면 진동
- **생명 감소**: 실패 3회 → 게임 오버

### 3.4 입력 관리 시스템

#### 입력 우선순위

1. **긴급 입력**: 일시정지 (최우선)
2. **게임 입력**: 이동, 도형/색상 변경
3. **UI 입력**: 메뉴, 설정

#### 크로스 플랫폼 입력 통합

- **Pointer Events API** 사용 (마우스 + 터치 통합)
- **키보드 + 게임패드** 지원 (향후 확장)
- **입력 버퍼링**: 빠른 입력도 누락 없이 처리

---

## 4. 데이터 구조 설계

### 4.1 게임 상태 (Zustand Store)

#### gameStore (메인 게임 상태)

```
{
  // 진행 상태
  level: number,              // 1-20
  score: number,
  catchCount: number,         // 현재 레벨에서 잡은 개수
  missCount: number,
  lives: number,              // 0-3

  // 콤보
  combo: number,
  maxCombo: number,
  comboTimer: number,         // 콤보 유지 타이머 (3초)

  // 게임 오브젝트
  currentShape: Shape | null,
  nextShape: Shape | null,
  catcher: Catcher,

  // 파워업
  activePowerUps: PowerUp[],
  powerUpInventory: {
    slowTime: number,
    autoMatch: number,
    doubleScore: number,
    shield: number,
    starShower: number
  },

  // 메타
  gameStatus: 'menu' | 'playing' | 'paused' | 'gameOver' | 'levelTransition',
  timeElapsed: number,

  // Actions
  startGame(),
  pauseGame(),
  catchShape(result),
  missShape(),
  updateCombo(success),
  activatePowerUp(type),
  nextLevel()
}
```

#### persistStore (영속 데이터)

```
{
  // 진행도
  highScore: number,
  maxLevelReached: number,
  totalPlayTime: number,

  // 통계
  totalCatches: number,
  totalMisses: number,
  bestCombo: number,

  // 언락
  unlockedSkins: string[],
  unlockedThemes: string[],
  achievements: Achievement[],

  // 설정
  settings: {
    musicVolume: number,
    sfxVolume: number,
    difficulty: 'easy' | 'normal' | 'hard'
  }
}
```

### 4.2 레벨 설정 구조

```
LevelConfig {
  level: number,
  fallSpeed: number,          // 도형 낙하 속도 (1.0 ~ 3.0)
  spawnInterval: number,      // 생성 간격 (ms)
  colorCount: number,         // 사용 가능한 색상 수 (3-6)
  scorePerCatch: number,      // 기본 점수 (10-50)
  specialShapeChance: number, // 특수 도형 확률 (0-0.25)
  bombChance: number,         // 폭탄 확률 (0-0.15)

  theme: {
    background: string,       // CSS gradient
    bgAnimation: string,      // 배경 애니메이션 타입
    music: string,           // BGM 파일명
    particleColor: string    // 파티클 주 색상
  }
}
```

### 4.3 도형 데이터 구조

```
Shape {
  id: string,                 // UUID
  type: ShapeType,           // square | triangle | star | circle
  color: ShapeColor,         // hex color
  specialType?: SpecialShapeType,

  // 물리
  position: { x: number, y: number },
  velocity: { x: number, y: number },
  rotation: number,

  // 렌더링
  size: number,
  glowEffect: boolean,
  trailEffect: boolean
}
```

### 4.4 파워업 데이터 구조

```
PowerUp {
  type: PowerUpType,
  duration?: number,         // 시간 기반 (초)
  remaining?: number,        // 카운트 기반
  activatedAt: number,       // timestamp

  config: {
    name: string,
    description: string,
    icon: string,
    effect: Function
  }
}
```

---

## 5. 게임 시스템 상세

### 5.1 레벨 시스템 (20레벨)

#### 레벨 진행 구조

| 레벨 범위 | 테마         | 난이도      | 주요 특징                  |
| --------- | ------------ | ----------- | -------------------------- |
| **1-3**   | 🌱 튜토리얼  | 매우 쉬움   | 기본 조작 학습             |
| **4-5**   | 🌿 기초      | 쉬움        | 특수 도형 등장             |
| **6-10**  | 🌊 물의 세계 | 보통        | 다이아몬드 등장, 폭탄 등장 |
| **11-15** | 🔥 불의 세계 | 어려움      | 레인보우 등장, 빠른 속도   |
| **16-19** | 🌌 우주      | 매우 어려움 | 골든 스타 등장             |
| **20**    | 👑 최종 보스 | 극한        | 모든 요소 집약             |

#### 레벨별 상세 설정

**레벨 1-3 (튜토리얼)**

- 낙하 속도: 1.0x (느림)
- 생성 간격: 2.5초
- 색상 종류: 3가지 (빨강, 파랑, 노랑)
- 특수 도형: 없음
- 점수: 10점/개
- 목표: 기본 조작 익히기

**레벨 4-5 (기초)**

- 낙하 속도: 1.2x
- 생성 간격: 2초
- 색상 종류: 3가지
- 특수 도형: 다이아몬드 5%
- 점수: 15점/개
- 목표: 특수 도형 경험

**레벨 6-10 (물의 세계)**

- 낙하 속도: 1.5x
- 생성 간격: 1.8초
- 색상 종류: 4가지 (초록 추가)
- 특수 도형: 다이아몬드 10%, 폭탄 3%
- 점수: 20점/개
- 배경: 물결 애니메이션
- 목표: 위험 요소 회피

**레벨 11-15 (불의 세계)**

- 낙하 속도: 2.0x
- 생성 간격: 1.3초
- 색상 종류: 5가지 (보라 추가)
- 특수 도형: 다이아몬드 15%, 레인보우 10%, 폭탄 8%
- 점수: 30점/개
- 배경: 화염 파티클
- 목표: 빠른 판단력

**레벨 16-19 (우주)**

- 낙하 속도: 2.5x
- 생성 간격: 1초
- 색상 종류: 6가지 (주황 추가)
- 특수 도형: 골든 스타 5%, 다이아몬드 15%, 폭탄 12%
- 점수: 40점/개
- 배경: 별자리 애니메이션
- 목표: 고득점 전략

**레벨 20 (최종 보스)**

- 낙하 속도: 3.0x (매우 빠름)
- 생성 간격: 0.8초
- 색상 종류: 6가지 + 랜덤 변화
- 특수 도형: 골든 스타 10%, 모든 특수 15%, 폭탄 15%
- 점수: 50점/개
- 배경: 은하 애니메이션 + 동적 효과
- 목표: 완벽한 플레이

### 5.2 콤보 시스템

#### 콤보 티어

| 콤보   | 메시지     | 보너스 점수 | 효과                           |
| ------ | ---------- | ----------- | ------------------------------ |
| 3연속  | NICE!      | +20         | 초록 파티클                    |
| 5연속  | GREAT!     | +50         | 파란 파티클 + 음향             |
| 10연속 | AMAZING!   | +150        | 보라 파티클 + 화면 테두리 빛남 |
| 15연속 | LEGENDARY! | +300        | 황금 파티클 + 슬로우 모션      |
| 20연속 | PERFECT!   | +500        | 레인보우 + 파워업 선택권       |

#### 콤보 유지 규칙

- **타이머**: 3초 이내에 다음 캐치 성공해야 유지
- **실패 시**: 콤보 즉시 리셋
- **쉴드 적용**: 쉴드로 막은 실패는 콤보 유지
- **시각적 피드백**: 콤보 타이머 바 표시

### 5.3 점수 시스템

#### 점수 계산 공식

```
최종 점수 = (기본 점수 × 특수 배율 × 파워업 배율) + 콤보 보너스
```

#### 레벨 클리어 보너스

| 조건            | 보너스 |
| --------------- | ------ |
| 퍼펙트 (20연속) | +500점 |
| 노미스 클리어   | +200점 |
| 15+ 콤보 달성   | +150점 |
| 특수 도형 5개+  | +100점 |

#### 등급 시스템

| 등급       | 아이콘 | 조건               | 보상                        |
| ---------- | ------ | ------------------ | --------------------------- |
| 🥉 Bronze  | 기본   | 20개 캐치          | 진행                        |
| 🥈 Silver  | 은메달 | 10+ 콤보           | +100점                      |
| 🥇 Gold    | 금메달 | 15+ 콤보           | +200점 + 파워업 1개         |
| 💎 Diamond | 다이아 | 퍼펙트             | +500점 + 파워업 2개         |
| 👑 Master  | 왕관   | 퍼펙트 + 특수 5개+ | +1000점 + 파워업 3개 + 칭호 |

### 5.4 파워업 시스템

#### 파워업 종류

**🔄 슬로우 타임**

- 효과: 모든 도형 낙하 속도 50% 감소
- 지속: 5초
- 획득: 골든 스타, 레벨 보상

**🎯 오토 매치**

- 효과: 다음 3개 도형 자동 매칭
- 카운트: 3회
- 획득: 골든 스타, 퍼펙트 레벨

**✨ 더블 스코어**

- 효과: 모든 점수 2배
- 지속: 10초
- 획득: 골든 스타, 15+ 콤보

**🛡️ 쉴드**

- 효과: 1회 실수 무효화 (폭탄 방어 가능)
- 카운트: 1회
- 획득: 골든 스타, 레벨 10, 15 클리어

**🌟 스타 쇼워**

- 효과: 5초간 모든 도형이 다이아몬드로 변경
- 지속: 5초
- 획득: 골든 스타 (희귀)

#### 파워업 획득 방법

1. **골든 스타 캐치**: 랜덤 1개 지급
2. **레벨 클리어 보상**: 등급에 따라 지급
3. **마일스톤**: 레벨 5, 10, 15, 20 클리어 시 선택권
4. **퍼펙트 보너스**: 퍼펙트 레벨 클리어 시 원하는 것 선택

### 5.5 난이도 조절 시스템

#### 적응형 난이도 (옵션)

- **실력 추적**: 최근 5레벨 평균 점수, 실수율 분석
- **자동 조정**:
  - 연속 실패 (3회 이상) → 속도 10% 감소 (최대 2회)
  - 연속 퍼펙트 (3회 이상) → 보너스 특수 도형 출현
  - 콤보 15+ 지속 → 난이도 점진적 증가

#### 난이도 모드 (설정)

- **Easy**: 낙하 속도 -20%, 생성 간격 +0.5초
- **Normal**: 기본 설정
- **Hard**: 낙하 속도 +20%, 폭탄 확률 +5%

---

## 6. UI/UX 컴포넌트 구조

### 6.1 화면 레이아웃

```
┌─────────────────────────────────────────────┐
│  [Status Bar] Lv.5  ❤️❤️❤️  850pts  🔥x3   │
│                                Next: ★🔵    │
├─────────────────────────────────────────────┤
│                                             │
│           [Game Canvas Area]                │
│                                             │
│                  ★                          │
│                                             │
│              ▽          💎                  │
│                                             │
│        ■                                    │
│                                             │
├─────────────────────────────────────────────┤
│  [Progress] ████████░░░░ 12/20              │
│                                             │
│  [PowerUps] 🔄x1  🎯x2  ✨x1  🛡️x1        │
│                                             │
│         [Catcher] ╰★─╯                      │
│                                             │
└─────────────────────────────────────────────┘
```

### 6.2 주요 컴포넌트

#### 게임 화면 컴포넌트

1. **StatusBar**: 레벨, 점수, 생명, 콤보, 시간 표시
2. **NextShapePreview**: 다음 도형 미리보기 (우측 상단)
3. **GameCanvas**: 메인 게임 렌더링 영역
4. **ProgressBar**: 진행도 (20개 중 몇 개 캐치)
5. **PowerUpBar**: 파워업 인벤토리 & 활성화 UI
6. **CatcherControl**: 캐처 렌더링 & 제어
7. **ComboDisplay**: 콤보 달성 시 메시지 표시
8. **ScorePopup**: 점수 획득 시 애니메이션

#### 메뉴 컴포넌트

1. **MainMenu**: 게임 시작, 모드 선택, 설정
2. **PauseMenu**: 재개, 재시작, 메인으로
3. **GameOverScreen**: 최종 점수, 통계, 재도전
4. **LevelTransition**: 레벨 클리어 결과, 등급 표시
5. **Leaderboard**: 순위표 (로컬/글로벌)
6. **Settings**: 음량, 난이도, 키 설정
7. **Achievements**: 업적 목록

#### 튜토리얼 컴포넌트

1. **TutorialOverlay**: 단계별 가이드
2. **ControlGuide**: 조작법 안내 (플랫폼별)
3. **HintSystem**: 상황별 힌트 표시

### 6.3 비주얼 이펙트

#### 파티클 시스템

- **성공 파티클**: 초록 → 파랑 → 보라 → 황금 (콤보에 따라)
- **폭발 파티클**: 폭탄 충돌 시 붉은 파티클
- **쉴드 파티클**: 청록색 방어막 효과
- **골든 트레일**: 골든 스타 낙하 시 황금 꼬리

#### 화면 효과

- **카메라 쉐이크**: 폭탄 충돌 시 (0.3초, 5px 진폭)
- **슬로우 모션**: 15+ 콤보 시 (0.5x 속도, 1초)
- **화면 테두리 빛남**: 10+ 콤보 시 (맥동 효과)
- **배경 동적 변화**: 콤보에 따라 색상 강조

#### 애니메이션

- **도형 회전**: 떨어지면서 360도 회전
- **캐처 바운스**: 캐치 성공 시 살짝 튕김
- **UI 트랜지션**: 모든 UI 요소 Fade/Slide 효과
- **레벨 전환**: 와이프 효과 + 테마 색상 변화

### 6.4 사운드 디자인

#### 효과음 (SFX)

| 액션       | 사운드              | 설명               |
| ---------- | ------------------- | ------------------ |
| 도형 변경  | `tick.mp3`          | 짧고 경쾌한 클릭음 |
| 색상 변경  | `whoosh.mp3`        | 스와이프 느낌      |
| 캐치 성공  | `ding.mp3`          | 청량한 벨 소리     |
| 캐치 실패  | `miss.mp3`          | 낮은 톤            |
| 콤보 3/5   | `combo_nice.mp3`    | 밝은 멜로디        |
| 콤보 10    | `combo_amazing.mp3` | 화려한 효과음      |
| 콤보 15/20 | `combo_legendary.mp |

🎮 Shape Catcher Game - Technical PRD v3.0 (계속) 6. UI/UX 컴포넌트 구조 (계속)
6.4 사운드 디자인 (계속)
효과음 (SFX)
액션 사운드 설명
도형 변경 tick.mp3 짧고 경쾌한 클릭음
색상 변경 whoosh.mp3 스와이프 느낌
캐치 성공 ding.mp3 청량한 벨 소리
캐치 실패 miss.mp3 낮은 톤
콤보 3/5 combo_nice.mp3 밝은 멜로디
콤보 10 combo_amazing.mp3 화려한 효과음
콤보 15/20 combo_legendary.mp3 오케스트라 히트
폭탄 폭발 bomb_explosion.mp3 폭발음 + 진동
쉴드 방어 shield_block.mp3 금속 방어음
파워업 획득 powerup_get.mp3 파워업 멜로디
파워업 사용 powerup_use.mp3 활성화 효과음
레벨업 level_up.mp3 팡파르
게임 오버 game_over.mp3 슬픈 멜로디
배경 음악 (BGM)
레벨 범위 테마 음악 스타일 파일명
1-3 튜토리얼 밝고 경쾌한 칩튠 tutorial.mp3
4-5 기초 경쾌한 8bit basic.mp3
6-10 물의 세계 잔잔한 신스팝 water_world.mp3
11-15 불의 세계 템포 빠른 일렉트로닉 fire_world.mp3
16-19 우주 몽환적 신스웨이브 space.mp3
20 최종 보스 에픽 오케스트라 + 일렉트로닉 final_boss.mp3
동적 음악 시스템
레이어 시스템: 콤보에 따라 악기 레이어 추가
기본: 멜로디 라인
3+ 콤보: 베이스 추가
10+ 콤보: 드럼 + 신스 추가
15+ 콤보: 풀 오케스트레이션
크로스페이드: 레벨 전환 시 2초 페이드
긴장감 조성: 생명 1개일 때 템포 증가 + 로우패스 필터 7. 파일 구조
7.1 전체 디렉토리 구조
shape-catcher/
├── public/
│ ├── assets/
│ │ ├── audio/
│ │ │ ├── bgm/
│ │ │ │ ├── tutorial.mp3
│ │ │ │ ├── water_world.mp3
│ │ │ │ ├── fire_world.mp3
│ │ │ │ ├── space.mp3
│ │ │ │ └── final_boss.mp3
│ │ │ └── sfx/
│ │ │ ├── tick.mp3
│ │ │ ├── ding.mp3
│ │ │ ├── bomb_explosion.mp3
│ │ │ └── ...
│ │ ├── images/
│ │ │ ├── backgrounds/
│ │ │ ├── skins/
│ │ │ └── icons/
│ │ └── fonts/
│ ├── favicon.ico
│ └── manifest.json
│
├── src/
│ ├── components/
│ │ ├── Game/
│ │ │ ├── Canvas.tsx
│ │ │ ├── Catcher.tsx
│ │ │ ├── Shape.tsx
│ │ │ ├── NextShapePreview.tsx
│ │ │ ├── PowerUpBar.tsx
│ │ │ └── ParticleEffect.tsx
│ │ │
│ │ ├── UI/
│ │ │ ├── StatusBar.tsx
│ │ │ ├── ProgressBar.tsx
│ │ │ ├── ComboDisplay.tsx
│ │ │ ├── ScorePopup.tsx
│ │ │ └── ControlGuide.tsx
│ │ │
│ │ ├── Menu/
│ │ │ ├── MainMenu.tsx
│ │ │ ├── PauseMenu.tsx
│ │ │ ├── GameOverScreen.tsx
│ │ │ ├── LevelTransition.tsx
│ │ │ ├── Leaderboard.tsx
│ │ │ ├── Settings.tsx
│ │ │ └── Achievements.tsx
│ │ │
│ │ └── Tutorial/
│ │ ├── TutorialOverlay.tsx
│ │ ├── TutorialStep.tsx
│ │ └── HintSystem.tsx
│ │
│ ├── core/ # 게임 엔진 코어
│ │ ├── GameEngine.ts
│ │ ├── GameLoop.ts
│ │ ├── PhysicsEngine.ts
│ │ ├── CollisionDetector.ts
│ │ ├── InputManager.ts
│ │ ├── ParticleSystem.ts
│ │ └── CameraController.ts
│ │
│ ├── game/ # 게임 로직
│ │ ├── ShapeManager.ts
│ │ ├── CatcherController.ts
│ │ ├── PowerUpManager.ts
│ │ ├── ComboSystem.ts
│ │ ├── ScoreCalculator.ts
│ │ ├── LevelManager.ts
│ │ └── AchievementManager.ts
│ │
│ ├── store/ # 상태 관리
│ │ ├── gameStore.ts
│ │ ├── uiStore.ts
│ │ ├── persistStore.ts
│ │ └── settingsStore.ts
│ │
│ ├── config/ # 설정 파일
│ │ ├── gameConfig.ts
│ │ ├── levelConfig.ts
│ │ ├── audioConfig.ts
│ │ ├── powerUpConfig.ts
│ │ ├── achievementConfig.ts
│ │ └── constants.ts
│ │
│ ├── utils/ # 유틸리티
│ │ ├── mathUtils.ts
│ │ ├── animationUtils.ts
│ │ ├── storageUtils.ts
│ │ ├── deviceDetector.ts
│ │ ├── colorUtils.ts
│ │ └── soundUtils.ts
│ │
│ ├── types/ # TypeScript 타입
│ │ ├── game.types.ts
│ │ ├── shape.types.ts
│ │ ├── powerup.types.ts
│ │ ├── level.types.ts
│ │ └── ui.types.ts
│ │
│ ├── hooks/ # Custom React Hooks
│ │ ├── useGameLoop.ts
│ │ ├── useInputHandler.ts
│ │ ├── useParticles.ts
│ │ ├── useAudio.ts
│ │ └── useLocalStorage.ts
│ │
│ ├── services/ # 외부 서비스
│ │ ├── AudioService.ts
│ │ ├── StorageService.ts
│ │ ├── AnalyticsService.ts
│ │ └── LeaderboardService.ts
│ │
│ ├── styles/
│ │ ├── globals.css
│ │ ├── animations.css
│ │ └── themes.css
│ │
│ ├── App.tsx
│ ├── main.tsx
│ └── vite-env.d.ts
│
├── tests/
│ ├── unit/
│ │ ├── ShapeManager.test.ts
│ │ ├── CollisionDetector.test.ts
│ │ ├── ScoreCalculator.test.ts
│ │ └── ComboSystem.test.ts
│ │
│ ├── integration/
│ │ ├── GameFlow.test.ts
│ │ └── PowerUpSystem.test.ts
│ │
│ └── e2e/
│ └── gameplay.spec.ts
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── README.md
└── PRD.md
7.2 핵심 파일 설명
게임 엔진 핵심 파일
GameEngine.ts

메인 게임 루프 관리
모든 시스템 통합 (물리, 충돌, 렌더링)
시간 스케일 제어 (파워업용)
ShapeManager.ts

도형 생성/제거 관리
특수 도형 확률 계산
다음 도형 미리 생성
CollisionDetector.ts

AABB 충돌 감지
매칭 로직 처리
특수 도형 예외 처리
InputManager.ts

크로스 플랫폼 입력 통합
키보드/터치/게임패드 지원
입력 버퍼링 및 디바운싱
ParticleSystem.ts

파티클 풀 관리
다양한 이펙트 타입
성능 최적화 (오브젝트 풀링)
게임 로직 파일
LevelManager.ts

레벨 진행 관리
테마 전환
난이도 조정
클리어 조건 체크
ComboSystem.ts

콤보 카운트 및 타이머
콤보 티어 계산
보너스 점수 계산
ScoreCalculator.ts

점수 계산 로직
등급 판정
보너스 계산
PowerUpManager.ts

파워업 활성화/비활성화
효과 적용
인벤토리 관리
상태 관리 파일
gameStore.ts

게임 진행 상태
실시간 데이터
액션 함수들
persistStore.ts

localStorage 대체 (메모리 기반)
최고 기록
언락 데이터
설정 저장 8. 개발 우선순위 & 로드맵
8.1 Phase 1: MVP (4주) - 핵심 게임플레이
Week 1: 기본 구조
프로젝트 셋업 (Vite + React + TypeScript)
기본 컴포넌트 구조 설계
Canvas 렌더링 시스템
게임 루프 구현
입력 시스템 (키보드/터치)
Week 2: 게임 메카닉
도형 생성 시스템 (4종 기본 도형)
캐처 제어 (이동/도형 변경/색상 변경)
충돌 감지 및 매칭 로직
다음 도형 미리보기
기본 점수 시스템
Week 3: 레벨 시스템
20레벨 설정 데이터
레벨 진행 로직
난이도 곡선 구현
레벨 전환 화면
진행도 UI
Week 4: 기본 UI & 테스트
상태바 (레벨, 점수, 생명)
메인 메뉴
게임 오버 화면
일시정지 기능
반응형 레이아웃 (모바일/데스크톱)
기본 QA 및 버그 수정
Milestone 1: 플레이 가능한 프로토타입

8.2 Phase 2: 재미 요소 (3주)
Week 5: 특수 도형 & 콤보
특수 도형 6종 구현
특수 도형 효과 (시각/음향)
콤보 시스템
콤보 UI 및 애니메이션
등급 시스템 (Bronze ~ Master)
Week 6: 비주얼 이펙트
파티클 시스템
성공/실패 파티클
화면 효과 (쉐이크, 슬로우모션)
도형 회전 애니메이션
UI 트랜지션
Week 7: 사운드 & 테마
효과음 통합 (Howler.js)
BGM 시스템 (레벨별)
동적 음악 레이어
레벨별 테마 (배경, 색상)
배경 애니메이션
Milestone 2: 완성도 높은 게임플레이

8.3 Phase 3: 파워업 & 진행 시스템 (2주)
Week 8: 파워업
5가지 파워업 구현
파워업 UI
골든 스타 드롭 시스템
파워업 효과 애니메이션
인벤토리 관리
Week 9: 진행 시스템
업적 시스템 (10개 이상)
칭호 시스템
통계 추적
영구 데이터 저장 (메모리 기반)
설정 메뉴
Milestone 3: 깊이 있는 진행 시스템

8.4 Phase 4: 추가 모드 & 소셜 (2주)
Week 10: 게임 모드
타임 어택 모드
엔드리스 모드
데일리 챌린지
난이도 설정 (Easy/Normal/Hard)
모드별 리더보드
Week 11: 소셜 & 커스터마이징
로컬 리더보드
점수 공유 기능
캐처 스킨 시스템 (5종)
배경 테마 (6종)
리플레이 녹화 (옵션)
Milestone 4: 다양한 플레이 경험

8.5 Phase 5: 튜토리얼 & 폴리싱 (1주)
Week 12: 마무리
인터랙티브 튜토리얼
힌트 시스템
성능 최적화
접근성 개선 (색맹 모드)
다국어 지원 준비
전체 QA 및 버그 수정
Milestone 5: 출시 준비 완료

8.6 Phase 6: 출시 & 운영 (지속)
출시 전
베타 테스트 (20명 이상)
피드백 반영
성능 모니터링 도구 설정
분석 도구 연동
문서화 완료
출시 후
사용자 피드백 수집
버그 핫픽스
밸런스 조정
새 콘텐츠 업데이트 (월 1회)
이벤트 운영 9. 성능 최적화 전략
9.1 렌더링 최적화
Canvas 최적화
더블 버퍼링: 화면 깜빡임 방지
Dirty Rectangle: 변경된 영역만 다시 그리기
레이어 분리: 정적 요소와 동적 요소 분리
오프스크린 캔버스: 복잡한 도형 미리 렌더링
React 최적화
React.memo: 불필요한 리렌더링 방지
useMemo/useCallback: 계산 결과 캐싱
가상화: 긴 리스트는 가상 스크롤 적용
Code Splitting: 라우트별 번들 분리
9.2 메모리 최적화
오브젝트 풀링
도형 풀: 도형 객체 재사용 (100개 풀)
파티클 풀: 파티클 객체 재사용 (500개 풀)
이벤트 풀: 이벤트 객체 재사용
메모리 관리
가비지 컬렉션 최소화: 객체 생성 줄이기
WeakMap 사용: 임시 데이터 저장
정기적 정리: 사용하지 않는 리소스 해제
9.3 네트워크 최적화
에셋 로딩
지연 로딩: 필요할 때만 로드
이미지 압축: WebP 포맷 사용
오디오 압축: MP3 128kbps
스프라이트 시트: 여러 이미지 하나로 통합
캐싱 전략
서비스 워커: 오프라인 캐싱
브라우저 캐시: 정적 리소스 장기 캐싱
CDN: 글로벌 배포
9.4 성능 목표
메트릭 목표 측정 방법
프레임레이트 60fps (데스크톱), 30fps (모바일) Performance API
입력 지연 < 50ms Input to Paint
초기 로딩 < 3초 Lighthouse
메모리 사용 < 100MB DevTools Memory
번들 크기 < 500KB (gzip) Bundle Analyzer
9.5 성능 모니터링
개발 환경
React DevTools Profiler: 렌더링 분석
Chrome DevTools Performance: 프레임 분석
Lighthouse: 종합 성능 측정
프로덕션 환경
Web Vitals: LCP, FID, CLS 추적
Error Tracking: Sentry 통합
Analytics: 사용자 행동 분석 10. 테스트 & QA
10.1 테스트 전략
Unit Tests (Vitest)
게임 로직: 점수 계산, 콤보 시스템, 충돌 감지
유틸리티: 수학 함수, 색상 변환, 저장소
커버리지 목표: 80% 이상
테스트 예시:

✓ ScoreCalculator
✓ 기본 점수 계산
✓ 특수 도형 배율 적용
✓ 콤보 보너스 계산
✓ 파워업 배율 적용

✓ CollisionDetector
✓ AABB 충돌 감지
✓ 완벽 매칭 검증
✓ 특수 도형 예외 처리
✓ 폭탄 충돌 처리

✓ ComboSystem
✓ 콤보 증가
✓ 타이머 관리
✓ 콤보 리셋
✓ 티어 계산
Integration Tests
게임 플로우: 시작 → 플레이 → 레벨 클리어 → 다음 레벨
파워업 시스템: 획득 → 사용 → 효과 적용
상태 관리: 스토어 액션 및 상태 동기화
E2E Tests (Playwright)
핵심 시나리오:
튜토리얼 완료
레벨 1-3 클리어
파워업 사용
게임 오버 및 재시작
리더보드 확인
10.2 QA 체크리스트
기능 테스트
모든 입력 방식 동작 (키보드/터치/마우스)
모든 도형 타입 정상 렌더링
매칭 로직 정확성
레벨 진행 정상 동작
파워업 효과 정확성
점수 계산 정확성
데이터 저장/로드
플랫폼 테스트
Chrome (최신)
Firefox (최신)
Safari (iOS/macOS)
Edge (최신)
모바일 (iOS Safari, Android Chrome)
태블릿
성능 테스트
60fps 유지 (데스크톱)
30fps 유지 (모바일)
메모리 누수 없음
입력 지연 < 50ms
로딩 시간 < 3초
접근성 테스트
키보드 전용 플레이 가능
색맹 모드 동작
화면 낭독기 호환 (기본)
명도 대비 충분
터치 영역 충분 (44x44px 이상)
사용자 경험 테스트
튜토리얼 이해도 (신규 사용자 10명)
조작 직관성
난이도 밸런스
재미 요소 만족도
버그 리포트 수집
10.3 버그 우선순위
우선순위 설명 대응 시간
P0 Critical 게임 중단, 데이터 손실 즉시 (4시간 이내)
P1 High 핵심 기능 오류 24시간 이내
P2 Medium 부분 기능 오류, UX 문제 3일 이내
P3 Low 사소한 UI 버그, 개선 사항 다음 업데이트 11. 추가 기능 & 확장성
11.1 향후 추가 기능
Phase 7: 고급 기능 (출시 후 1-3개월)
멀티플레이어: 1v1 대결 모드
시즌 시스템: 3개월마다 새 시즌, 테마, 보상
길드/클랜: 팀 리더보드, 협동 챌린지
커스텀 레벨: 레벨 에디터, 공유 기능
크로스 플랫폼 세이브: 클라우드 동기화
Phase 8: 콘텐츠 확장 (출시 후 3-6개월)
새 도형: 육각형, 하트, 다이아 등 (총 10종)
보스 레벨: 레벨 10, 20에 특별 보스 등장
스토리 모드: 캐릭터 + 스토리라인
미니게임: 보너스 스테이지, 타깃 슈팅
프리미엄 스킨: 애니메이션 스킨, 특수 효과
11.2 수익화 모델 (옵션)
무료 버전
광고 배치 (레벨 전환, 리워드)
기본 콘텐츠 전체 플레이 가능
프리미엄 옵션
광고 제거: $2.99
스타터 팩: $4.99 (파워업 + 스킨)
시즌 패스: $9.99/시즌 (독점 콘텐츠)
스킨 팩: $1.99 (테마별 5개 묶음)
11.3 기술 확장성
아키텍처 확장
마이크로 프론트엔드: 기능별 모듈 분리
서버리스 백엔드: 리더보드, 멀티플레이어
GraphQL API: 유연한 데이터 페칭
WebSocket: 실시간 멀티플레이어
플랫폼 확장
네이티브 앱: React Native 포팅
데스크톱 앱: Electron 래핑
콘솔 게임: Switch, PlayStation 고려
VR/AR: 3D 버전 실험 12. 문서화 & 협업
12.1 개발 문서
README.md
markdown

# Shape Catcher Game

## 빠른 시작

npm install
npm run dev

## 빌드

npm run build

## 테스트

npm run test
npm run test:e2e

## 배포

npm run deploy
CONTRIBUTING.md
코드 스타일 가이드
커밋 메시지 규칙
PR 프로세스
브랜치 전략
API.md
게임 엔진 API 문서
컴포넌트 Props 레퍼런스
스토어 액션 목록
이벤트 시스템
12.2 협업 도구
용도 도구 설명
버전 관리 GitHub 소스 코드, 이슈 트래킹
프로젝트 관리 Notion/Linear 태스크, 스프린트
디자인 Figma UI/UX, 프로토타입
커뮤니케이션 Slack/Discord 팀 소통
CI/CD GitHub Actions 자동 배포
모니터링 Sentry 에러 추적
12.3 브랜치 전략
main (프로덕션)
├── develop (개발)
│ ├── feature/game-loop
│ ├── feature/power-ups
│ └── feature/leaderboard
├── hotfix/critical-bug
└── release/v1

🎮 Shape Catcher Game - Technical PRD v3.0 (계속) 12. 문서화 & 협업 (계속)
12.3 브랜치 전략 (계속)
main (프로덕션)
├── develop (개발)
│ ├── feature/game-loop
│ ├── feature/power-ups
│ ├── feature/leaderboard
│ └── feature/tutorial
├── hotfix/critical-bug
└── release/v1.0.0
브랜치 규칙
main: 프로덕션 배포용, 항상 안정적
develop: 개발 통합 브랜치
feature/_: 새 기능 개발
bugfix/_: 버그 수정
hotfix/_: 긴급 수정
release/_: 릴리즈 준비
커밋 메시지 규칙
<type>(<scope>): <subject>

[optional body]

[optional footer]
타입:

feat: 새 기능
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가/수정
chore: 빌드/설정 변경
예시:

feat(game): add combo system with particle effects

- Implement combo counter and timer
- Add particle effects for combo milestones
- Update score calculation with combo bonus

Closes #42 13. 보안 & 데이터 관리
13.1 클라이언트 보안
데이터 검증
입력 검증: 모든 사용자 입력 sanitize
점수 검증: 클라이언트 점수 서버 검증 (향후)
치트 방지: 난독화, 무결성 체크
저장소 보안
메모리 기반 저장: localStorage 대신 메모리 사용
데이터 암호화: 민감 정보 암호화 (향후)
XSS 방지: React 기본 보호 + 추가 sanitization
13.2 데이터 관리
로컬 데이터 구조
typescript
// 메모리에 저장되는 데이터
interface PersistentData {
player: {
id: string; // UUID
name: string;
createdAt: number;
};

progress: {
highScore: number;
maxLevelReached: number;
totalPlayTime: number;
gamesPlayed: number;
};

stats: {
totalCatches: number;
totalMisses: number;
bestCombo: number;
perfectLevels: number;
specialShapesCaught: number;
};

unlocks: {
skins: string[];
themes: string[];
achievements: Achievement[];
};

settings: {
musicVolume: number; // 0-1
sfxVolume: number; // 0-1
difficulty: DifficultyLevel;
colorBlindMode: boolean;
language: string;
};
}
세션 데이터
typescript
// 게임 세션 동안만 유지
interface SessionData {
currentRun: {
startTime: number;
level: number;
score: number;
combo: number;
powerUpsUsed: PowerUpType[];
};

analytics: {
actions: GameAction[]; // 사용자 행동 로그
performance: PerformanceMetric[];
};
}
13.3 프라이버시
데이터 수집 (GDPR 준수)
필수 데이터: 게임 진행도, 설정
선택 데이터: 분석 데이터 (동의 필요)
수집 안 함: 개인 식별 정보
사용자 권리
데이터 확인: 저장된 데이터 보기
데이터 삭제: 모든 데이터 초기화
데이터 내보내기: JSON 형식 다운로드 14. 분석 & 메트릭
14.1 게임 메트릭
핵심 지표 (KPI)
메트릭 목표 측정 방법
DAU (일일 활성 사용자) 1,000명 고유 플레이어 수
재방문율 40% 7일 내 재방문
평균 세션 시간 15분 플레이 시간 평균
레벨 완료율 60% 레벨 1 완료 / 시작
레벨 10 도달률 30% 레벨 10 도달 / 전체
레벨 20 클리어율 5% 레벨 20 클리어 / 전체
게임플레이 메트릭
평균 점수: 레벨별, 전체
평균 콤보: 최대 콤보 평균
파워업 사용률: 파워업별 사용 빈도
특수 도형 캐치율: 특수 도형별
게임 오버 원인: 생명 소진 vs 포기
14.2 사용자 행동 분석
이벤트 추적
typescript
// 주요 이벤트
enum AnalyticsEvent {
GAME_START = 'game_start',
LEVEL_COMPLETE = 'level_complete',
GAME_OVER = 'game_over',
POWERUP_USED = 'powerup_used',
ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
TUTORIAL_COMPLETE = 'tutorial_complete',
SETTING_CHANGED = 'setting_changed'
}

// 이벤트 데이터
interface EventData {
event: AnalyticsEvent;
timestamp: number;
properties: {
level?: number;
score?: number;
powerUpType?: string;
achievementId?: string;
// ...
};
}
퍼널 분석
100% → 튜토리얼 시작
90% → 튜토리얼 완료
80% → 레벨 1 시작
60% → 레벨 1 완료
50% → 레벨 5 도달
30% → 레벨 10 도달
10% → 레벨 15 도달
5% → 레벨 20 클리어
14.3 A/B 테스트 계획
테스트 항목
난이도 밸런스
A: 현재 속도
B: 속도 -10%
측정: 레벨 완료율, 만족도
파워업 드롭율
A: 골든 스타 5%
B: 골든 스타 10%
측정: 파워업 사용률, 점수
콤보 타이머
A: 3초
B: 4초
측정: 평균 콤보, 플레이 만족도
UI 레이아웃
A: 현재 레이아웃
B: 다음 도형 좌측 배치
측정: 반응 시간, 선호도 15. 다국어 지원 계획
15.1 지원 언어 (1차)
언어 코드 우선순위
한국어 ko P0 (기본)
영어 en P0
일본어 ja P1
중국어 간체 zh-CN P1
스페인어 es P2
15.2 번역 구조
i18n 파일 구조
locales/
├── ko/
│ ├── common.json # 공통 문구
│ ├── game.json # 게임 내 문구
│ ├── menu.json # 메뉴 문구
│ └── tutorial.json # 튜토리얼
├── en/
│ ├── common.json
│ ├── game.json
│ ├── menu.json
│ └── tutorial.json
└── ...
번역 키 예시
json
// ko/game.json
{
"combo": {
"nice": "좋아요!",
"great": "대단해요!",
"amazing": "놀라워요!",
"legendary": "전설이다!",
"perfect": "완벽해요!"
},
"grade": {
"bronze": "동메달",
"silver": "은메달",
"gold": "금메달",
"diamond": "다이아",
"master": "마스터"
},
"powerup": {
"slowTime": "슬로우 타임",
"autoMatch": "자동 매칭",
"doubleScore": "더블 스코어",
"shield": "쉴드",
"starShower": "스타 샤워"
}
}
15.3 현지화 고려사항
문화적 차이
색상 의미: 문화권별 색상 인식 차이
UI 방향: RTL 언어 지원 (아랍어 등)
숫자 표기: 천 단위 구분 (1,000 vs 1.000)
날짜 형식: MM/DD vs DD/MM
기술적 구현
react-i18next 사용
동적 로딩: 필요한 언어만 로드
폴백: 번역 없을 시 영어로 대체
변수 치환: {{level}}레벨 형식 지원 16. 접근성 (Accessibility)
16.1 접근성 기준 (WCAG 2.1 Level AA)
시각적 접근성
색맹 모드: 도형에 패턴 추가
빨강: 대각선 줄무늬
파랑: 점무늬
노랑: 격자무늬
초록: 체크무늬
보라: 물결무늬
주황: 별무늬
명도 대비: 4.5:1 이상
크기 조절: 텍스트 200% 확대 지원
애니메이션 감소: 옵션 제공
청각적 접근성
자막: 모든 음향 효과에 시각적 피드백
진동: 모바일에서 촉각 피드백 (옵션)
음향 없이 플레이 가능: 시각적 단서 충분
조작 접근성
키보드 전용: 모든 기능 키보드로 가능
터치 영역: 최소 44x44px
타이밍 조절: 난이도 설정으로 속도 조절
일시정지: 언제든 가능
16.2 접근성 기능
키보드 내비게이션
Tab: 다음 요소
Shift+Tab: 이전 요소
Enter/Space: 선택
Esc: 일시정지/메뉴
←→: 캐처 이동
↑↓: 색상 변경
Space: 도형 변경
화면 낭독기 지원
ARIA 레이블: 모든 UI 요소
실시간 업데이트: 점수, 콤보 변화 알림
게임 상태: 현재 레벨, 진행도 안내
설정 옵션
색맹 모드 ON/OFF
애니메이션 감소
고대비 모드
큰 글씨
진동 피드백 (모바일)
오디오 큐 강화 17. 마케팅 & 성장 전략
17.1 런칭 전략
Soft Launch (1-2주)
목표: 피드백 수집, 버그 수정
대상: 한국 사용자 500명
채널: 지인, 커뮤니티 (디스코드, 레딧)
측정: 버그 리포트, 난이도 피드백
Global Launch
목표: 10,000 DAU
대상: 전세계
채널:
ProductHunt 런칭
Reddit (r/WebGames, r/incremental_games)
Hacker News Show HN
Twitter/X 캠페인
게임 리뷰 사이트
17.2 성장 전략
바이럴 요소
점수 공유: SNS 이미지 자동 생성
챌린지: "20레벨 클리어 챌린지"
리더보드: 친구 초대 시 보너스
일일 챌린지: 매일 새로운 도전
콘텐츠 마케팅
플레이 영상: 유튜브 쇼츠, 틱톡
공략 가이드: 블로그 포스트
개발 일지: 개발 과정 공유
커뮤니티: 디스코드 서버 운영
파트너십
인플루언서: 게임 스트리머 협업
교차 프로모션: 유사 게임과 협력
학교/교육: 반응속도 훈련 도구로 홍보
17.3 유저 유지 (Retention)
일일 보상
로그인 보상: 파워업, 스킨
일일 미션: 특정 조건 달성 시 보상
출석 이벤트: 7일 연속 시 특별 보상
콘텐츠 업데이트
주간 챌린지: 매주 새 챌린지
월간 이벤트: 특별 테마, 한정 스킨
시즌 패스: 3개월 시즌 시스템
커뮤니티 참여
사용자 피드백: 정기적 설문
요청 기능: 투표로 다음 기능 결정
팬 아트: 우수작 게임 내 적용 18. 위험 관리 (Risk Management)
18.1 기술적 위험
위험 가능성 영향도 대응 방안
성능 이슈 (저사양 기기) 높음 높음 성능 프로파일링, 최적화, 품질 설정
브라우저 호환성 중간 높음 폴리필, 크로스 브라우저 테스트
메모리 누수 중간 중간 정기적 메모리 프로파일링, 오브젝트 풀링
입력 지연 낮음 높음 입력 버퍼링, 프레임 스킵 방지
18.2 비즈니스 위험
위험 가능성 영향도 대응 방안
낮은 사용자 유입 중간 높음 다각화된 마케팅, 바이럴 요소 강화
높은 이탈률 중간 높음 튜토리얼 개선, 난이도 조절, A/B 테스트
부정적 피드백 낮음 중간 빠른 버그 수정, 커뮤니티 소통
모방 게임 높음 낮음 지속적 혁신, 커뮤니티 강화
18.3 운영 위험
위험 가능성 영향도 대응 방안
서버 다운 (향후) 낮음 높음 CDN, 로드 밸런싱, 모니터링
보안 취약점 낮음 높음 정기 보안 감사, 업데이트
데이터 손실 낮음 중간 메모리 기반 (손실 영향 최소), 백업 19. 예산 & 리소스
19.1 개발 리소스
인력 (3개월)
개발자 1명: 풀타임
디자이너 0.5명: 파트타임 (UI/그래픽)
사운드 디자이너 0.2명: 프리랜서
QA 테스터 0.5명: 파트타임 (마지막 1개월)
도구 & 서비스
개발 도구: 무료 (VS Code, GitHub)
디자인 도구: Figma Pro ($12/월)
호스팅: Vercel Free Tier
도메인: $15/년
CDN: Cloudflare Free
에셋: $100 (오디오, 일부 그래픽)
총 예산: ~$500
19.2 운영 비용 (월)
최소 운영 (1,000 DAU)
호스팅: $0 (Free Tier)
CDN: $0
모니터링: $0 (Free Tier)
총: $0/월
성장기 (10,000 DAU)
호스팅: $20
CDN: $50
모니터링: $30
총: $100/월
대규모 (100,000 DAU)
호스팅: $200
CDN: $300
데이터베이스: $100
모니터링: $100
총: $700/월 20. 성공 기준 & KPI
20.1 런칭 후 1개월 목표
지표 목표 측정 도구
총 플레이어 5,000명 Google Analytics
DAU 1,000명 GA
평균 세션 10분 GA
레벨 5 도달률 40% Custom Events
재방문율 30% GA
버그 리포트 < 10개 (P0/P1) GitHub Issues
평균 평점 4.0/5.0 사용자 피드백
20.2 3개월 목표
지표 목표
총 플레이어 50,000명
DAU 5,000명
레벨 10 도달률 25%
레벨 20 클리어 500명
SNS 공유 1,000회
커뮤니티 회원 500명
20.3 6개월 목표
지표 목표
총 플레이어 200,000명
DAU 20,000명
월간 수익 (광고) $1,000
앱스토어 순위 Top 100 (Puzzle)
미디어 노출 10개 이상 21. 결론 & 다음 단계
21.1 프로젝트 요약
Shape Catcher Game은 단순하지만 중독성 있는 게임플레이를 통해 폭넓은 사용자층을 타겟으로 하는 웹 기반 아케이드 게임입니다.

핵심 강점:

✅ 직관적인 조작과 빠른 학습 곡선
✅ 레벨별 난이도 증가로 도전 의식 자극
✅ 콤보, 파워업 등 다양한 재미 요소
✅ 크로스 플랫폼 지원 (모바일/데스크톱)
✅ 확장 가능한 아키텍처
21.2 즉시 실행 항목
Week 1 (지금 시작)
프로젝트 셋업
bash
npm create vite@latest shape-catcher -- --template react-ts
cd shape-catcher
npm install zustand tailwindcss framer-motion howler
기본 구조 생성
/src 폴더 구조 생성
TypeScript 설정
Tailwind 설정
Canvas 기본 렌더링
GameCanvas 컴포넌트
기본 도형 그리기
게임 루프 구현
입력 시스템
InputManager 클래스
키보드 이벤트
터치 이벤트
Week 2-4
Phase 1 로드맵 따라 진행
매일 커밋, 주간 리뷰
기능별 브랜치 관리
21.3 성공을 위한 체크리스트
개발
타입 안정성 유지 (TypeScript strict mode)
코드 리뷰 습관화
테스트 커버리지 80% 이상
성능 프로파일링 정기적 실행
문서화 동시 진행
출시
베타 테스터 20명 이상 모집
크로스 브라우저 테스트 완료
성능 목표 달성 확인
마케팅 자료 준비 (스크린샷, 영상)
소셜 미디어 계정 생성
운영
사용자 피드백 채널 구축
버그 리포트 프로세스 확립
정기 업데이트 계획 수립
커뮤니티 관리 계획
21.4 최종 조언
Claude Code 사용 시 팁:

명확한 지시: "X 기능을 Y 방식으로 구현해줘" 형식
단계별 진행: 큰 기능을 작은 단위로 분할
코드 리뷰: AI 생성 코드도 반드시 검토
테스트 우선: 핵심 로직은 테스트 먼저 작성
문서화: 복잡한 로직은 주석과 문서 추가
개발 원칙:

🎯 완성도 > 기능: 적은 기능이라도 완벽하게
🚀 빠른 출시: MVP 먼저, 확장은 나중에
📊 데이터 기반: 추측 말고 측정하고 결정
👥 사용자 중심: 플레이어 피드백 최우선
🔄 지속적 개선: 작은 업데이트를 자주
📚 참고 자료
개발 리소스
React 공식 문서
TypeScript 핸드북
Canvas API MDN
Game Programming Patterns
Zustand 문서
게임 디자인
The Art of Game Design
Game Feel by Steve Swink
Juice it or lose it (GDC Talk)
성능 최적화
Web.dev Performance
Canvas Performance Tips
📝 문서 버전 관리
v1.0 (2024-01-XX): 초기 PRD 작성
v2.0 (2024-XX-XX): 재미 요소 추가
v3.0 (2024-XX-XX): Claude Code 최적화 버전 (현재)
✅ 다음 단계: 개발 시작
이 PRD를 기반으로 다음 명령어로 프로젝트를 시작하세요:

bash

# 1. 프로젝트 생성

npm create vite@latest shape-catcher -- --template react-ts

# 2. 디렉토리 이동

cd shape-catcher

# 3. 의존성 설치

npm install
npm install zustand tailwindcss postcss autoprefixer
npm install framer-motion gsap howler
npm install -D @types/howler vitest @vitest/ui

# 4. Tailwind 초기화

npx tailwindcss init -p

# 5. 개발 서버 시작

npm run dev
첫 번째 이슈 생성:

markdown
Title: [Setup] 프로젝트 기본 구조 설정

Tasks:

- [ ] Vite + React + TypeScript 프로젝트 생성
- [ ] 폴더 구조 생성 (/core, /game, /components, /store)
- [ ] Tailwind CSS 설정
- [ ] 기본 타입 정의 (types/game.types.ts)
- [ ] GameEngine.ts 뼈대 작성
- [ ] Canvas 컴포넌트 기본 렌더링

Estimate: 4 hours
Priority: P0
Happy Coding! 🎮✨
