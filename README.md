# To-Do List 애플리케이션

## 프로젝트 개요

이 프로젝트는 React와 TypeScript를 사용하여 구현된 할 일 관리(To-Do List) 애플리케이션입니다. 사용자는 할 일을 추가, 수정, 삭제하고 완료 상태를 관리할 수 있습니다.

## 기술 스택

- **Frontend**: React, TypeScript
- **상태 관리**: Zustand
- **API 통신**: React Query, Axios
- **스타일링**: Styled Components
- **개발 도구**: Vite, ESLint, Prettier
- **API Mocking**: MSW (Mock Service Worker)

## 주요 기능

- 할 일 항목 추가 (내용 및 기한 설정)
- 할 일 항목 수정
- 할 일 완료 처리
- 다중 선택 삭제
- 3일 이내 기한 시각적 표시
- 페이지네이션 지원
- 검색 기능 (브라우저 새로고침 후에도 유지)

## 프로젝트 구조

```
src/
├── api/             # API 호출 관련 함수
├── components/      # React 컴포넌트
├── hooks/           # 커스텀 훅
├── mocks/           # MSW 설정 (API 모킹)
├── store/           # Zustand 상태 관리
├── types/           # TypeScript 타입 정의
├── App.tsx          # 메인 애플리케이션 컴포넌트
└── main.tsx         # 애플리케이션 진입점
```

## 구현 과정

### 1. 프로젝트 초기 설정

- Vite를 사용하여 React + TypeScript 프로젝트 생성
- ESLint, Prettier 설정으로 코드 품질 관리
- 필요한 패키지 설치 (React Query, Zustand, Styled Components, MSW 등)

### 2. 타입 정의

- ToDo 인터페이스 및 API 응답 타입 정의
- 컴포넌트 Props 타입 정의

### 3. API 인터페이스 구현

- Axios를 사용한 API 클라이언트 구성
- 할 일 목록 조회, 추가, 수정, 삭제 등의 API 함수 구현
- MSW를 사용한 API 모킹 설정

### 4. 상태 관리 구성

- Zustand를 사용한 애플리케이션 상태 관리
- 로컬 스토리지를 활용한 검색어 상태 유지
- 할 일 선택, 편집 상태 관리

### 5. 컴포넌트 개발

- Layout: 애플리케이션 레이아웃 구성
- TodoForm: 새로운 할 일 추가 폼
- TodoList: 할 일 목록 표시, 페이지네이션 구현
- TodoItem: 개별 할 일 항목 표시, 체크박스, 편집/삭제 기능
- TodoEditForm: 할 일 수정 폼
- TodoSearch: 검색 기능 구현

### 6. 기능 구현

- React Query를 사용한 데이터 페칭 및 캐싱
- 커스텀 훅을 통한 비즈니스 로직 분리
- Styled Components를 활용한 UI 디자인 구현
- 다중 선택 및 일괄 삭제 기능 구현
- 기한 임박 항목 강조 표시
- 검색 기능 및 브라우저 리로드 후에도 검색어 유지

### 7. 최적화 및 품질 관리

- React Query를 활용한 데이터 캐싱으로 성능 최적화
- 컴포넌트 분리를 통한 재사용성 및 유지보수성 향상
- useMemo, useCallback을 활용한 렌더링 최적화

## 실행 방법

1. 패키지 설치
```bash
npm install
```

2. 개발 서버 실행
```bash
npm run dev
```

3. 빌드
```bash
npm run build
```

4. 프로덕션 빌드 미리보기
```bash
npm run preview
```

## 배포 URL
- https://todo-app-pdk.vercel.app/