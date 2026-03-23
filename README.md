# 📚 상식 퀴즈

초등학교 5학년 수준의 한국사 · 과학 · 영어 상식 퀴즈 게임입니다.

## 시작하기

```bash
npm install
npm run dev
```

## 주요 명령어

```bash
npm run dev      # 개발 서버 실행 (Vite HMR)
npm run build    # 타입 검사 + 프로덕션 빌드
npm run lint     # ESLint 검사
npm run preview  # 프로덕션 빌드 미리보기
```

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 19 + TypeScript (Vite) |
| 스타일링 | Tailwind CSS v4 (`@tailwindcss/vite`) |
| 상태 관리 | Zustand |
| 라우팅 | React Router v6 |
| 아이콘 | Lucide React |

## 게임 구조

### 화면 흐름

```
홈(/) → 닉네임 입력(/nickname) → 카테고리 선택(/category)
  → 퀴즈(/quiz) → 카테고리 결과(/result/category)
  → (카테고리 선택으로 돌아가거나) 최종 결과(/result/final)
```

### 카테고리

| 카테고리 | 문제 수 | 설명 |
|----------|---------|------|
| 📜 한국사 | 20문제 | 선사~근현대, 문화유산, 독립운동 |
| 🔬 과학  | 20문제 | 생물·지구과학·물리·화학·인체 |
| 🔤 영어  | 20문제 | 5학년 교과서 어휘·문법·의사소통 |

### 점수 규칙

- 정답: **+10점**
- 10초 이내 정답: **+5점 추가 보너스** (최대 15점)
- 오답 / 시간 초과: **0점**
- 카테고리 전체 정답(20/20): **+50점 보너스**

### 등급 기준

| 점수 | 등급 | 메시지 |
|------|------|--------|
| 550점 이상 | S 🏆 | 퀴즈 천재! |
| 450~549점 | A ⭐ | 훌륭해요! |
| 350~449점 | B 👍 | 잘했어요! |
| 250~349점 | C 😊 | 조금만 더! |
| 249점 이하 | D 💪 | 다시 도전! |

### 리더보드

- `localStorage` (`quiz_leaderboard` 키)에 저장
- 최대 20개 항목, 총점 내림차순 정렬
- 플레이 후 최종 결과 화면에서 자동 저장 (`/leaderboard`에서 확인)

## 프로젝트 구조

```
src/
  components/       # 공통 UI 컴포넌트
    Button.tsx        variant(primary/secondary/ghost) × size(sm/md/lg)
    Card.tsx          hover-lift, selected ring
    Badge.tsx         카테고리 색상 자동 적용
    ProgressBar.tsx   CSS transition 진행 바
    LeaderboardModal.tsx  리더보드 오버레이 모달
    FeedbackOverlay.tsx   답변 후 바텀 시트(결과·점수·해설·2초 자동 이동)
    Modal.tsx             범용 확인 모달 (ESC/배경 클릭 닫기)
    ErrorBoundary.tsx     렌더 에러 경계 (fallback UI + 홈 복귀)
  pages/            # 라우트 페이지
    HomePage.tsx       타이틀·시작 버튼·순위 모달
    NicknamePage.tsx   실시간 유효성 검사 (2~10자, 한/영/숫자)
    CategorySelectPage.tsx  카드형 카테고리 선택 + 진행 현황
    QuizPage.tsx       원형 SVG 타이머(색상 변환+깜박임), 선택지 셔플, FeedbackOverlay 연동
    CategoryResultPage.tsx  정답률 링 차트, 오답 상세(접기/펼치기), 퍼펙트 보너스 분리 표시
    FinalResultPage.tsx     총점 카운트업(RAF·easeOutCubic)·S~D 등급·카테고리 막대 그래프·공유·팡파레 사운드
    LeaderboardPage.tsx     포디엄(TOP 3)·테이블(4~20위)·현재 세션 강조·데이터 초기화
    SettingsPage.tsx        사운드 토글·폰트 크기·리더보드 초기화 (/settings)
    NotFoundPage.tsx        404 페이지 (홈으로 복귀 버튼)
  store/
    gameStore.ts      Zustand 스토어 (점수 계산, 리더보드 I/O)
  data/
    questions.ts      60문제 (카테고리별 20문제)
  hooks/
    useTimer.ts       문제별 카운트다운 타이머 (useReducer 기반)
    useSettings.ts    설정 관리 (useSyncExternalStore + localStorage pub/sub)
    useSoundEffects.ts Web Audio API 사운드 이펙트 (외부 파일 없음)
  utils/
    quiz.ts           shuffleArray, shuffleOptions, formatTime, getGrade, getCategoryLabel/Emoji
  types/
    index.ts          Category, Difficulty, Question, PlayerRecord, GameSession
```

## 주요 기능

| 기능 | 설명 |
|------|------|
| 사운드 이펙트 | Web Audio API 기반 programmatic 생성 (외부 파일 없음). 정답/오답/타임아웃/레벨업/최종 팡파레 |
| 키보드 네비게이션 | 퀴즈 화면에서 숫자키 1~4로 선택지 선택, ESC로 피드백 건너뛰기 |
| 접근성 (WCAG 2.1 AA) | `aria-label` 선택지, `aria-live` 타이머 공지(10/5/3초), `aria-live="assertive"` 결과 공지, `role="dialog"` 피드백 오버레이 |
| 애니메이션 | 오답 shake, 점수 float-up, 타이머 숫자 pulse, 페이지 fade-up/slide |
| 설정 | 사운드 on/off, 폰트 크기 기본/크게 (전체 UI rem 스케일링) |
| 에러 처리 | ErrorBoundary, 404 페이지, localStorage 실패 시 조용한 처리 |

## 디자인 시스템

- **메인 컬러**: `#3B5BA5` (딥 블루)
- **포인트 컬러**: `#FF6B35` (오렌지)
- CSS 애니메이션: `.animate-float` / `.animate-fade-up` / `.animate-scale-in` / `.animate-slide-up` / `.animate-sparkle` / `.animate-shake` / `.animate-float-up` / `.animate-timer-num-pulse` / `.animate-slide-in-right` (`src/index.css`)
- 반응형: 모바일(375px) ~ 데스크탑(1280px)
- 폰트 크기: `html { font-size: var(--app-font-size, 16px) }` — 설정에서 크게(18px) 변경 가능
