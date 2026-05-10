# 컬러랩 — AI 퍼스널컬러 진단 서비스

10문항 설문 + AI 사진 분석으로 퍼스널컬러를 정확하게 진단하는 서비스입니다.

## 기술 스택

| 영역 | 스택 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 데이터베이스 | Supabase (PostgreSQL) |
| AI | Anthropic Claude (Vision 포함) |
| 결제 | 토스페이먼츠 위젯 |
| 이메일 | Resend |
| 배포 | Vercel |

---

## 환경 변수 설정

루트 디렉토리에 `.env.local` 파일을 생성하고 아래 값을 채워주세요.

```env
# ── Supabase ──────────────────────────────────────────────
# Supabase 대시보드 > Settings > API 에서 확인
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...   # 절대 클라이언트에 노출 금지

# ── Anthropic ─────────────────────────────────────────────
# https://console.anthropic.com/settings/keys
ANTHROPIC_API_KEY=sk-ant-api03-...

# ── 토스페이먼츠 ──────────────────────────────────────────
# 토스페이먼츠 개발자센터 > 내 상점 > API 키
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_... # 브라우저 노출 OK
TOSS_SECRET_KEY=test_sk_...             # 서버 전용, 절대 노출 금지

# ── Resend ────────────────────────────────────────────────
# https://resend.com/api-keys
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@colorlab.kr          # Resend에서 인증된 도메인만 가능

# ── 앱 설정 ───────────────────────────────────────────────
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # 배포 시 실제 URL로 변경

# ── 가격 (원) ─────────────────────────────────────────────
PRICE=4900
```

> **보안 주의사항**  
> `SUPABASE_SERVICE_ROLE_KEY`, `TOSS_SECRET_KEY`, `ANTHROPIC_API_KEY`, `RESEND_API_KEY`는  
> 절대 `NEXT_PUBLIC_` 접두사를 붙이지 마세요.  
> `.env.local`은 `.gitignore`에 포함되어 있습니다. 커밋하지 마세요.

---

## 로컬 개발 실행

### 사전 준비

- Node.js 18+
- Supabase 프로젝트 생성 완료

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
# .env.local 파일 생성 후 위 환경 변수 값 입력

# 3. Supabase 마이그레이션 실행
# Supabase 대시보드 > SQL Editor 에서 아래 파일 내용 실행
# supabase/migrations/001_init.sql

# 4. 개발 서버 시작
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

### 주요 명령어

```bash
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버
npm run lint      # ESLint
npx tsc --noEmit  # 타입 검사
```

---

## Supabase 설정

### 테이블 생성

Supabase 대시보드 **SQL Editor**에서 `supabase/migrations/001_init.sql` 실행.

```
생성 테이블:
  test_sessions  — 테스트 세션 및 AI 리포트
  payments       — 결제 기록
RLS: 비활성화 (서버 사이드 service_role key 전용 접근)
```

---

## 토스페이먼츠 설정

1. [토스페이먼츠 개발자센터](https://developers.tosspayments.com) 접속
2. 내 상점 > API 키에서 **테스트 키** 복사
3. `.env.local`에 `NEXT_PUBLIC_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY` 입력
4. 성공/실패 콜백 URL (코드에서 자동 설정):
   - 성공: `{BASE_URL}/api/payment/confirm`
   - 실패: `{BASE_URL}/api/payment/fail`

> 프로덕션 시 **라이브 키**로 교체

---

## Resend 이메일 설정

1. [resend.com](https://resend.com) 계정 생성 및 도메인 인증
2. API 키 생성 → `RESEND_API_KEY`
3. `FROM_EMAIL`을 인증 도메인 이메일로 설정

> 도메인 인증 전 테스트: `onboarding@resend.dev` 사용 가능

---

## Vercel 배포 가이드

### 1. 배포

```bash
npm i -g vercel
vercel
```

또는 vercel.com에서 GitHub 저장소 Import.

### 2. 환경 변수

Vercel 대시보드 > Settings > Environment Variables에서 모든 변수 입력.

| 변수 | 환경 |
|------|------|
| `NEXT_PUBLIC_*` | Production + Preview + Development |
| 나머지 모든 키 | Production + Preview |

### 3. 배포 체크리스트

- [ ] `NEXT_PUBLIC_BASE_URL` → 실제 도메인 (예: `https://colorlab.kr`)
- [ ] 토스페이먼츠 **라이브 키**로 교체
- [ ] Resend 도메인 인증 완료
- [ ] Vercel **Pro 플랜** 사용 (AI 분석 함수 타임아웃 60초 필요)

> **중요:** Vercel Hobby 플랜은 서버리스 함수 타임아웃 10초 제한.  
> AI 분석(`/api/analyze`)은 최대 60초이므로 **Pro 플랜 이상** 필요.

---

## 프로젝트 구조

```
colorlab/
├── app/
│   ├── (test)/              # 라우트 그룹 (URL 미영향)
│   │   ├── test/            # /test
│   │   ├── result/[id]/     # /result/:id
│   │   ├── pay/[id]/        # /pay/:id
│   │   ├── upload/[id]/     # /upload/:id
│   │   └── report/[id]/     # /report/:id
│   ├── api/
│   │   ├── analyze/         # POST — AI 분석
│   │   ├── payment/confirm/ # GET — 결제 승인
│   │   ├── payment/fail/    # GET — 결제 실패
│   │   └── share-card/      # GET — OG 이미지
│   ├── privacy/             # 개인정보처리방침
│   ├── terms/               # 이용약관
│   ├── error.tsx            # 전역 에러
│   ├── not-found.tsx        # 404
│   ├── loading.tsx          # 전역 로딩
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 랜딩 페이지
│   ├── sitemap.ts           # /sitemap.xml
│   └── robots.ts            # /robots.txt
├── components/
│   ├── test/   result/   report/   pay/   upload/
├── lib/
│   ├── supabase/   anthropic/   toss/   email/
│   ├── store/      utils/       colorData.ts   colorLogic.ts
│   └── questions.ts
├── types/index.ts
└── supabase/migrations/001_init.sql
```

---

© 2025 컬러랩. All rights reserved.
