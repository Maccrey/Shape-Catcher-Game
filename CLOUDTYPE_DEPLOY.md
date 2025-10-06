# CloudType 배포 가이드

Shape Catcher Game을 CloudType에 배포하는 방법입니다.

---

## ⚡ 긴급: "연결된 도메인이 없습니다" 해결

**빌드는 성공했지만 도메인이 안 나타나나요?**

### 즉시 해결 방법 (3분)

1. **CloudType 대시보드 → 프로젝트 선택**
2. **"설정" 탭 클릭**
3. **"포트" 섹션에서 포트 추가**:
   ```
   컨테이너 포트: 3000
   프로토콜: HTTP
   공개: ✅ (체크 필수!)
   ```
4. **저장**
5. **도메인 자동 생성**: `https://port-3000-xxxxx.cloudtype.app`

**상세 가이드**: [CLOUDTYPE_PORT_SETUP.md](CLOUDTYPE_PORT_SETUP.md) 참고

---

## 📋 배포 전 체크리스트

- [x] 프로덕션 빌드 성공 (68.73 KB)
- [x] TypeScript 에러 없음
- [x] Git 저장소 준비 완료
- [x] CloudType 계정 준비
- [x] GitHub 저장소 연동

---

## 🚀 CloudType 배포 방법

### 1단계: CloudType 프로젝트 생성

1. **CloudType 접속**

   - https://cloudtype.io 접속
   - GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - "새 프로젝트" 클릭
   - "GitHub 저장소 연결" 선택
   - `shape_catcher_game` 저장소 선택

### 2단계: 빌드 설정

**프로젝트 타입**: `Static Site` 또는 `Node.js`

#### CloudType 입력 필드별 설정값

| 필드 | 설정값 | 설명 |
|------|--------|------|
| **Port** | `3000` | 서버 포트 번호 |
| **Install command** | `npm ci` | 의존성 설치 (package-lock.json 기반) |
| **Build command** | `npm run build` | TypeScript 컴파일 + Vite 빌드 |
| **Start command** | `npm start` | serve 패키지로 정적 파일 서빙 |
| **Health Check** | `/` | 루트 경로 헬스체크 |

**상세 빌드 설정**:

```yaml
# 프로젝트 타입
Project Type: Static Site

# Node.js 버전
Node Version: 18.x (또는 20.x)

# 패키지 매니저
Package Manager: npm

# 의존성 설치 (자동 실행)
Install Command: npm ci

# 빌드 명령어
Build Command: npm run build

# 빌드 출력 디렉토리
Output Directory: dist

# 환경 변수 (선택사항)
NODE_ENV: production
```

**환경 변수** (필요 시):

```bash
NODE_ENV=production
```

### 3단계: 정적 파일 배포 설정

**배포 구성**:

```yaml
# 정적 파일 제공 경로
Static Files Directory: dist

# SPA 라우팅 (Single Page Application)
# CloudType에서 "SPA" 옵션 체크
SPA Mode: ✅ 활성화

# 또는 수동 Rewrite 규칙:
Rewrite Rules:
  - /* → /index.html

# 캐시 설정 (선택사항)
Cache Headers:
  /assets/* → Cache-Control: public, max-age=31536000, immutable
  /*.js → Cache-Control: public, max-age=31536000, immutable
  /*.css → Cache-Control: public, max-age=31536000, immutable
  /index.html → Cache-Control: no-cache
```

### 4단계: 배포 실행

1. **설정 확인**

   - 모든 빌드 설정 확인
   - Git 브랜치: `main` 확인

2. **배포 시작**

   - "배포" 버튼 클릭
   - 자동 빌드 & 배포 시작

3. **배포 완료**
   - 배포 로그 확인
   - 배포 URL 확인

---

## 📝 CloudType 프로젝트 설정 파일

### cloudtype.json (선택사항)

프로젝트 루트에 `cloudtype.json` 생성:

```json
{
  "name": "shape-catcher-game",
  "app": "static",
  "options": {
    "nodeVersion": "18",
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "spa": true
  },
  "context": {
    "main": {
      "build": {
        "commands": ["npm ci", "npm run build"]
      }
    }
  }
}
```

---

## 🔧 빌드 명령어

CloudType에서 사용할 빌드 스크립트:

### package.json 확인

현재 설정된 스크립트:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### 빌드 프로세스

1. **TypeScript 컴파일**: `tsc`

   - 타입 체크
   - 에러 검증

2. **Vite 빌드**: `vite build`
   - 번들링
   - 최적화
   - dist 폴더에 출력

---

## 📂 배포 디렉토리 구조

```
dist/
├── index.html           (진입점)
├── assets/
│   ├── css/
│   │   └── index-*.css  (스타일)
│   └── js/
│       ├── index-*.js   (메인)
│       ├── react-vendor-*.js
│       ├── game-core-*.js
│       ├── game-managers-*.js
│       └── (lazy-loaded chunks)
├── manifest.json        (PWA)
├── robots.txt          (SEO)
├── sitemap.xml         (SEO)
└── vite.svg            (파비콘)
```

---

## 🌐 배포 후 설정

### 1. 도메인 확인 및 설정

**CloudType 자동 도메인 확인**:

1. **CloudType 대시보드 접속**
   - https://cloudtype.io 로그인
   - 배포한 프로젝트 선택

2. **도메인 확인 방법**
   - 프로젝트 상세 페이지에서 "도메인" 또는 "URL" 섹션 확인
   - 자동으로 할당된 URL 복사
   - 형식: `https://port-3000-[프로젝트ID].cloudtype.app`

3. **도메인이 안 보이는 경우**
   - "설정" → "포트" 섹션 확인
   - Port 3000이 Public으로 설정되어 있는지 확인
   - Public 포트가 없으면 "포트 추가" 클릭:
     ```
     Port: 3000
     Type: HTTP
     Public: ✅ 체크
     ```

**커스텀 도메인 연결** (선택사항):

1. CloudType 프로젝트 "도메인" 탭 이동
2. "커스텀 도메인 추가" 클릭
3. 도메인 입력 (예: game.yourdomain.com)
4. DNS 레코드 설정:
   ```
   Type: CNAME
   Name: game (또는 @)
   Value: [CloudType 제공 URL]
   ```

### 2. HTTPS 설정

- CloudType은 자동으로 HTTPS 제공
- Let's Encrypt SSL 인증서 자동 발급
- 추가 설정 불필요

### 3. 환경별 배포

**개발 환경**:

- 브랜치: `develop`
- URL: `https://dev-shape-catcher.cloudtype.app`

**프로덕션 환경**:

- 브랜치: `main`
- URL: `https://shape-catcher.cloudtype.app`

---

## 🔍 배포 검증

### 배포 후 체크리스트

1. **사이트 접속 확인**

   ```bash
   # CloudType 제공 URL로 접속
   https://[your-project].cloudtype.app
   ```

2. **게임 기능 테스트**

   - [ ] 메인 메뉴 로드
   - [ ] 게임 시작
   - [ ] 레벨 진행
   - [ ] 파워업 동작
   - [ ] 메뉴 전환

3. **PWA 테스트**

   - [ ] manifest.json 로드 확인
   - [ ] "홈 화면에 추가" 동작
   - [ ] Standalone 모드 동작

4. **SEO 확인**

   - [ ] robots.txt 접근 가능
   - [ ] sitemap.xml 접근 가능
   - [ ] Meta 태그 확인 (소스 보기)

5. **성능 테스트**

   ```bash
   # Lighthouse 실행
   lighthouse https://[your-project].cloudtype.app --view
   ```

   **목표 점수**:

   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 95+
   - SEO: 90+

---

## 🔄 자동 배포 설정

### GitHub Actions (선택사항)

CloudType은 기본적으로 Git push 시 자동 배포되지만,
추가 CI/CD가 필요한 경우:

```yaml
# .github/workflows/cloudtype-deploy.yml
name: CloudType Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Test build output
        run: |
          ls -la dist/
          du -sh dist/
```

---

## 🐛 트러블슈팅

### 문제 1: 빌드 실패

**원인**: Node.js 버전 불일치
**해결**:

```yaml
# cloudtype.json에서 Node 버전 명시
"nodeVersion": "18"
```

### 문제 2: SPA 라우팅 404 에러

**원인**: Rewrite 규칙 누락
**해결**:

```yaml
# CloudType 설정에서 SPA 옵션 활성화
spa: true
# 또는
Rewrite: /* → /index.html
```

### 문제 3: 정적 파일 404

**원인**: Output Directory 설정 오류
**해결**:

```yaml
# 정확한 빌드 디렉토리 지정
Output Directory: dist
```

### 문제 4: 빌드 타임아웃

**원인**: 의존성 설치 시간 초과
**해결**:

```bash
# package-lock.json 커밋 확인
git add package-lock.json
git commit -m "chore: add package-lock.json"

# CloudType 빌드 타임아웃 증가 (설정에서)
```

### 문제 5: 도메인이 안 보임

**증상**:
```
서버는 시작되었지만 (localhost:3000)
CloudType에서 접속할 도메인을 찾을 수 없음
```

**원인**: Port가 Public으로 노출되지 않음

**해결 방법**:

1. **CloudType 대시보드로 이동**
   - 프로젝트 선택
   - "설정" 탭 클릭

2. **포트 설정 확인**
   - "포트" 또는 "Port" 섹션 찾기
   - Port 3000이 있는지 확인

3. **Public 포트 추가** (없는 경우)
   - "포트 추가" 또는 "Add Port" 클릭
   - 다음과 같이 설정:
     ```
     Container Port: 3000
     Protocol: HTTP
     Public: ✅ (체크 필수!)
     ```

4. **도메인 확인**
   - 저장 후 프로젝트 대시보드로 돌아가기
   - "URL" 또는 "도메인" 섹션에 URL 표시됨
   - 형식: `https://port-3000-xxxxx.cloudtype.app`

5. **재배포** (필요 시)
   - 포트 설정 변경 후 재배포가 필요할 수 있음
   - "재배포" 버튼 클릭

**확인 방법**:
```bash
# 할당된 URL로 접속 테스트
curl https://port-3000-xxxxx.cloudtype.app

# 또는 브라우저에서 직접 접속
```

---

## 📊 CloudType vs 다른 플랫폼

| 기능             | CloudType | Vercel | Netlify |
| ---------------- | --------- | ------ | ------- |
| 한국 서버        | ✅        | ❌     | ❌      |
| 빠른 로딩 (국내) | ✅        | ❌     | ❌      |
| 무료 티어        | ✅        | ✅     | ✅      |
| 자동 HTTPS       | ✅        | ✅     | ✅      |
| GitHub 연동      | ✅        | ✅     | ✅      |
| 한국어 지원      | ✅        | ❌     | ❌      |
| 빌드 시간        | 보통      | 빠름   | 빠름    |

**CloudType 장점**:

- 🇰🇷 한국 서버 (빠른 응답 속도)
- 🇰🇷 한국어 UI/지원
- 💰 합리적인 가격
- 🔧 쉬운 설정

---

## 📈 배포 후 최적화

### 1. CDN 캐싱 활용

CloudType의 CDN을 통한 자동 캐싱:

- 정적 파일 자동 캐싱
- Gzip 압축 자동 적용
- HTTP/2 지원

### 2. 모니터링 설정

```javascript
// src/main.tsx에 추가
if (import.meta.env.PROD) {
  // CloudType 배포 환경에서 에러 추적
  window.addEventListener("error", (e) => {
    console.error("Production Error:", e);
    // 에러 리포팅 서비스 연동
  });
}
```

### 3. 성능 모니터링

```javascript
// 성능 메트릭 수집
if (import.meta.env.PROD) {
  const perfData = performance.getEntriesByType("navigation")[0];
  console.log("Load Time:", perfData.loadEventEnd - perfData.fetchStart);
}
```

---

## 🔐 보안 설정

### 보안 헤더 추가

CloudType 설정에서 커스텀 헤더 추가:

```yaml
Headers:
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## 📞 지원 및 문서

### CloudType 공식 문서

- 웹사이트: https://cloudtype.io
- 문서: https://docs.cloudtype.io
- 고객 지원: support@cloudtype.io
- 커뮤니티: https://community.cloudtype.io

### Shape Catcher 관련 문서

- [빠른 배포 가이드](QUICK_DEPLOY.md)
- [종합 배포 가이드](DEPLOYMENT_GUIDE.md)
- [배포 준비 체크리스트](DEPLOYMENT_READINESS.md)
- [프로젝트 상태](PROJECT_STATUS.md)

---

## 🎯 CloudType 배포 요약

### 빠른 배포 (5분)

1. **CloudType 접속 & 로그인**

   ```
   https://cloudtype.io
   ```

2. **GitHub 저장소 연결**

   - 새 프로젝트 생성
   - shape_catcher_game 선택

3. **빌드 설정 입력**

   | 필드 | 입력값 |
   |------|--------|
   | Port | `3000` |
   | Install command | `npm ci` |
   | Build command | `npm run build` |
   | Start command | `npm start` |
   | Health Check | `/` |

4. **배포 실행**
   - "배포" 버튼 클릭
   - 2-3분 대기
   - 완료!

### 배포 URL

```
https://[your-project-name].cloudtype.app
```

### 핵심 설정 요약

```yaml
# 프로젝트 타입
Type: Node.js

# 필수 설정
Port: 3000
Install Command: npm ci
Build Command: npm run build
Start Command: npm start
Health Check: /

# 선택 설정
Node Version: 18.x
Environment: NODE_ENV=production
```

**중요**: `npm start` 명령어는 `serve` 패키지를 사용하여 빌드된 정적 파일을 서빙합니다.
```json
"scripts": {
  "start": "serve -s dist -l 3000"
}
```

---

## ✅ 체크리스트

### 배포 전

- [x] 프로덕션 빌드 성공
- [x] Git 커밋 완료
- [ ] CloudType 계정 생성
- [ ] GitHub 저장소 public 설정

### 배포 중

- [ ] CloudType 프로젝트 생성
- [ ] 빌드 설정 완료
- [ ] 배포 실행
- [ ] 빌드 로그 확인

### 배포 후

- [ ] URL 접속 확인
- [ ] 게임 기능 테스트
- [ ] Lighthouse 점수 확인
- [ ] PWA 동작 확인
- [ ] 도메인 설정 (선택)

---

## 🚀 바로 배포하기

**모든 준비가 완료되었습니다!**

### Step 1: 로컬 빌드 확인

```bash
# 최종 빌드 테스트
npm run build

# 빌드 결과 확인 (68.73 KB 예상)
ls -lh dist/
```

### Step 2: Git 푸시

```bash
# 변경사항 푸시 (아직 안 했다면)
git push origin main
```

### Step 3: CloudType 배포

1. **https://cloudtype.io** 접속
2. **GitHub 계정으로 로그인**
3. **"새 프로젝트"** 클릭
4. **GitHub 저장소 선택**: `shape_catcher_game`
5. **빌드 설정 입력**:

   ```
   Port:              3000
   Install command:   npm ci
   Build command:     npm run build
   Start command:     npm start
   Health Check:      /
   ```

6. **"배포" 버튼 클릭**
7. **2-3분 대기 후 완료!**

### 배포 완료 후

배포가 완료되면 다음 URL로 접속 가능:

```
https://[your-project-name].cloudtype.app
```

**Shape Catcher를 CloudType에 배포하세요! 🎮☁️**

---

_Last updated: 2025-10-05_
_CloudType 배포 가이드 v1.1_
