# 📅 연차관리 서비스 (Time and Attendance)

> 팀의 연차를 간편하게 관리할 수 있는 웹 애플리케이션입니다.

그룹 코드 기반의 간편한 접속 방식으로, 별도의 회원가입 없이 팀 단위로 연차 현황을 공유하고 관리할 수 있도록 개발하였습니다.

<br>

## 🔗 배포 링크

**[Live Demo](https://time-and-attendance-seven.vercel.app/)**

<br>

## 📌 프로젝트 소개

### 개발 배경

팀에서 연차 현황을 엑셀이나 구두로 공유하다 보면 누락되거나 혼선이 생기는 경우가 종종 있었습니다. 이러한 불편함을 해소하고자, 누구나 쉽게 접근하여 실시간으로 연차 현황을 확인할 수 있는 서비스를 만들어보았습니다.

### 주요 특징

- **간편한 접속**: 회원가입 없이 그룹 코드만으로 팀에 참여할 수 있습니다
- **실시간 공유**: 팀원 모두가 동일한 연차 현황을 실시간으로 확인할 수 있습니다
- **법정 연차 자동 계산**: 한국 근로기준법에 따른 연차 일수를 자동으로 계산합니다
- **직관적인 캘린더 뷰**: 월별 연차 사용 현황을 한눈에 파악할 수 있습니다

<br>

## 🛠 기술 스택

### Frontend
| 기술 | 설명 |
|:---|:---|
| **React 18** | 사용자 인터페이스 구축 |
| **TypeScript** | 정적 타입을 통한 코드 안정성 확보 |
| **Vite** | 빠른 개발 환경 및 빌드 도구 |
| **Tailwind CSS** | 유틸리티 기반 스타일링 |
| **Radix UI** | 접근성을 고려한 UI 컴포넌트 |

### Backend & Infrastructure
| 기술 | 설명 |
|:---|:---|
| **Supabase** | PostgreSQL 기반 BaaS (인증, 데이터베이스) |
| **Vercel** | 프론트엔드 배포 및 서버리스 함수 |

### 주요 라이브러리
| 라이브러리 | 용도 |
|:---|:---|
| **React Router DOM** | 클라이언트 사이드 라우팅 |
| **date-fns** | 날짜 연산 및 포맷팅 |
| **Lucide React** | 아이콘 라이브러리 |

<br>

## 📁 프로젝트 구조

```
Time-and-Attendance/
├── api/
│   └── keep-alive.ts          # Supabase 연결 유지를 위한 서버리스 함수
├── src/
│   ├── components/
│   │   ├── ui/                # Radix UI 기반 공통 UI 컴포넌트
│   │   ├── AddLeaveModal.tsx  # 연차 등록 모달
│   │   ├── AddMemberModal.tsx # 멤버 추가 모달
│   │   ├── MemberDetailModal.tsx # 멤버 상세 및 연차 관리 모달
│   │   ├── Navbar.tsx         # 상단 네비게이션 바
│   │   ├── HelpButton.tsx     # 도움말 버튼
│   │   └── Toast.tsx          # 토스트 알림 컴포넌트
│   ├── context/
│   │   └── AppContext.tsx     # 전역 상태 관리 (React Context)
│   ├── hooks/
│   │   ├── use-mobile.ts      # 모바일 반응형 감지 훅
│   │   └── use-toast.ts       # 토스트 알림 커스텀 훅
│   ├── lib/
│   │   ├── supabase.ts        # Supabase 클라이언트 설정
│   │   └── utils.ts           # 유틸리티 함수
│   ├── pages/
│   │   ├── Home.tsx           # 메인 페이지 (캘린더 뷰)
│   │   ├── Login.tsx          # 로그인/그룹 생성 페이지
│   │   └── Members.tsx        # 멤버 관리 페이지
│   ├── types/
│   │   └── index.ts           # TypeScript 타입 정의
│   ├── utils/
│   │   └── leaveCalculator.ts # 연차 계산 로직
│   ├── App.tsx                # 앱 라우팅 설정
│   └── index.tsx              # 앱 진입점
├── tailwind.config.js         # Tailwind CSS 설정
├── vite.config.ts             # Vite 빌드 설정
└── vercel.json                # Vercel 배포 설정
```

<br>

## ✨ 주요 기능

### 1. 그룹 관리

#### 그룹 생성 및 참여
- 새로운 그룹을 생성하면 고유한 그룹 코드가 발급됩니다
- 발급된 코드를 팀원들에게 공유하여 함께 사용할 수 있습니다
- 그룹 코드 입력만으로 간편하게 접속할 수 있습니다

```typescript
// 그룹 코드 생성 로직
const code = `GROUP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
```

### 2. 멤버 관리

#### 멤버 등록 및 관리
- 멤버 이름과 입사일을 입력하여 등록합니다
- 입사일을 기준으로 연차 발생 주기와 일수가 자동으로 계산됩니다
- 멤버 정보 수정 및 삭제가 가능합니다

### 3. 연차 관리

#### 연차 유형
| 유형 | 차감 일수 | 표시 색상 |
|:---|:---:|:---|
| 연차 (전일) | 1일 | 파란색 |
| 오전 반차 | 0.5일 | 노란색 |
| 오후 반차 | 0.5일 | 보라색 |

#### 연차 조정
- 이월, 특별휴가 등의 사유로 연차 일수를 조정할 수 있습니다
- 조정된 연차는 해당 연차 주기에만 적용됩니다

### 4. 연차 자동 계산

한국 근로기준법 제60조에 따른 연차 계산 로직을 구현하였습니다.

```typescript
// 연차 계산 핵심 로직
export function calculateTotalLeave(joinDate: string, periodYear: number): number {
  // 1년 미만: 매월 1개 발생 (최대 11개)
  if (periodYear === 1 && monthsDiff < 12) {
    return Math.min(Math.max(monthsDiff, 0), 11);
  }
  
  // 1~2년차: 15일
  if (workingYears < 3) {
    return 15;
  }
  
  // 3년차 이상: 2년마다 1일 추가 (최대 25일)
  const additionalLeave = Math.floor((workingYears - 1) / 2);
  return Math.min(15 + additionalLeave, 25);
}
```

#### 근속연수별 연차 일수
| 근속연수 | 연차 일수 |
|:---:|:---:|
| 1년 미만 | 매월 1일 (최대 11일) |
| 1~2년 | 15일 |
| 3~4년 | 16일 |
| 5~6년 | 17일 |
| ... | ... |
| 21년 이상 | 25일 (상한) |

### 5. 캘린더 뷰

- 월별 연차 사용 현황을 캘린더 형태로 제공합니다
- 날짜별로 연차를 사용한 멤버를 한눈에 확인할 수 있습니다
- 오늘 날짜가 하이라이트 되어 현재 위치를 쉽게 파악할 수 있습니다

<br>

## 🗄 데이터베이스 설계

### ERD

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│    groups    │      │   members    │      │    leaves    │
├──────────────┤      ├──────────────┤      ├──────────────┤
│ id (PK)      │─────<│ id (PK)      │─────<│ id (PK)      │
│ code         │      │ group_id(FK) │      │ member_id(FK)│
│ created_at   │      │ name         │      │ date         │
└──────────────┘      │ join_date    │      │ type         │
                      │ created_at   │      │ created_at   │
                      └──────────────┘      └──────────────┘
                             │
                             └─────<┌─────────────────────────┐
                                    │ member_leave_adjustments │
                                    ├─────────────────────────┤
                                    │ id (PK)                 │
                                    │ member_id (FK)          │
                                    │ year                    │
                                    │ adjustment              │
                                    │ created_at              │
                                    └─────────────────────────┘
```

### 테이블 설명

| 테이블 | 설명 |
|:---|:---|
| `groups` | 그룹 정보 (그룹 코드) |
| `members` | 멤버 정보 (이름, 입사일) |
| `leaves` | 연차 사용 내역 (날짜, 유형) |
| `member_leave_adjustments` | 연차 조정 내역 (연도별 조정값) |

<br>

## 🚀 설치 및 실행

### 사전 요구사항

- Node.js 18.x 이상
- npm 또는 yarn
- Supabase 계정 (데이터베이스 사용 시)

### 설치

```bash
# 저장소 클론
git clone https://github.com/000Lee/Time-and-Attendance.git

# 디렉토리 이동
cd Time-and-Attendance

# 의존성 설치
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 입력합니다:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 실행

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

개발 서버는 기본적으로 `http://localhost:5173` 에서 실행됩니다.

<br>

## 📱 반응형 디자인

모바일 환경에서도 불편함 없이 사용할 수 있도록 반응형 레이아웃을 적용하였습니다.

- 모바일: 단일 컬럼 레이아웃
- 태블릿: 2컬럼 그리드
- 데스크톱: 3컬럼 그리드

<br>

## 🔒 그룹코드

- 그룹 코드는 무작위 문자열로 생성됩니다.

<br>

## 🙏 개선하고 싶은 점

아직 부족한 부분이 많지만, 앞으로 다음과 같은 기능들을 추가해보고 싶습니다:

- [ ] 그룹 코드 확인 기능 추가 (현재는 최초 그룹 생성 시에만 확인 가능)
- [ ] 모바일 반응형 개선: 캘린더 크기 유지 + 가로 스크롤 방식으로 변경
- [ ] 연차 사용 내역 엑셀 다운로드 기능
- [ ] PWA 지원으로 모바일 앱처럼 사용

<br>

## 📝 배운 점

이 프로젝트를 통해 다음과 같은 것들을 배우고 경험할 수 있었습니다:

- **React Context API**를 활용한 전역 상태 관리
- **Supabase**를 이용한 서버리스 백엔드 구축
- **TypeScript**를 통한 타입 안전성 확보
- **Tailwind CSS**를 활용한 빠른 UI 개발
- **Vercel**을 이용한 배포 자동화

<br>

## 📄 라이선스

이 프로젝트는 개인 학습 및 포트폴리오 목적으로 제작되었습니다.

<br>

---

<p align="center">
  읽어주셔서 감사합니다. 🙇‍♂️
</p>
