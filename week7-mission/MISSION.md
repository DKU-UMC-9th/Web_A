# Week 7 Mission: useMutation & Optimistic Updates

## 🎯 미션 목표
- `useMutation`을 활용하여 서버 상태 손쉽게 관리하기
- 낙관적 업데이트(Optimistic Update)를 활용해서 빛보다 빠르게 업데이트하기

## 📚 구현 내용

### 1. useMutation 구현
React Query의 `useMutation` 훅을 사용하여 다음 기능을 구현했습니다:

#### Create (생성)
```typescript
const createMutation = useMutation({
  mutationFn: (input: CreateTodoInput) => todoApi.createTodo(input),
  onMutate: async (newTodo) => {
    // 낙관적 업데이트 구현
  },
  onError: (err, newTodo, context) => {
    // 에러 발생 시 롤백
  },
  onSettled: () => {
    // 최종적으로 데이터 refetch
  },
});
```

#### Update (수정)
```typescript
const updateMutation = useMutation({
  mutationFn: (input: UpdateTodoInput) => todoApi.updateTodo(input),
  // ... 낙관적 업데이트 로직
});
```

#### Delete (삭제)
```typescript
const deleteMutation = useMutation({
  mutationFn: (id: number) => todoApi.deleteTodo(id),
  // ... 낙관적 업데이트 로직
});
```

### 2. Optimistic Update 구현

낙관적 업데이트는 다음과 같은 단계로 구현됩니다:

#### Step 1: 진행 중인 쿼리 취소
```typescript
await queryClient.cancelQueries({ queryKey: ['todos'] });
```

#### Step 2: 이전 데이터 스냅샷 저장
```typescript
const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);
```

#### Step 3: 캐시에 낙관적으로 새 데이터 설정
```typescript
queryClient.setQueryData<Todo[]>(['todos'], (old) => 
  old ? [...old, optimisticTodo] : [optimisticTodo]
);
```

#### Step 4: 컨텍스트 반환 (롤백용)
```typescript
return { previousTodos };
```

#### Step 5: 에러 발생 시 롤백
```typescript
onError: (err, newTodo, context) => {
  if (context?.previousTodos) {
    queryClient.setQueryData(['todos'], context.previousTodos);
  }
  alert(`작성 실패: ${err.message}`);
}
```

### 3. 주요 특징

#### ⚡ 빠른 UI 응답
- 서버 응답을 기다리지 않고 즉시 UI가 업데이트됩니다
- 사용자는 지연 없이 바로 다음 작업을 수행할 수 있습니다

#### 🔄 자동 롤백
- API 호출이 실패하면 자동으로 이전 상태로 롤백됩니다
- 사용자에게 에러 메시지를 표시합니다

#### 🔄 자동 동기화
- `onSettled`에서 `invalidateQueries`를 호출하여 서버 데이터와 동기화합니다
- 성공하든 실패하든 최종적으로 서버의 실제 데이터를 가져옵니다

## 🛠️ 기술 스택
- React 19
- TypeScript
- Vite
- TanStack Query (React Query) v5
- CSS Modules

## 📁 프로젝트 구조
```
src/
├── api/
│   └── todoApi.ts          # Mock API (서버 시뮬레이션)
├── components/
│   ├── TodoList.tsx        # Todo 리스트 컴포넌트
│   └── TodoList.css        # 스타일
├── types/
│   └── todo.ts             # TypeScript 타입 정의
├── App.tsx                 # 메인 App 컴포넌트
├── main.tsx                # 진입점 (QueryClientProvider 설정)
└── index.css               # 전역 스타일
```

## 🚀 실행 방법

### 설치
```bash
cd week7-mission
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

## 💡 학습 포인트

### 1. useMutation의 장점
- 서버 상태 변경 로직을 선언적으로 관리
- 로딩, 에러, 성공 상태를 자동으로 추적
- 캐시 무효화 및 refetch를 쉽게 처리

### 2. Optimistic Update의 장점
- 즉각적인 UI 피드백으로 사용자 경험 향상
- 네트워크 지연을 사용자가 느끼지 못하게 함
- 실패 시 자동 롤백으로 안전성 보장

### 3. 주의사항
- 낙관적 업데이트 시 임시 ID 사용 (서버에서 실제 ID를 받을 때까지)
- 에러 처리를 반드시 구현하여 사용자에게 피드백 제공
- onSettled에서 invalidateQueries로 최종 동기화 필수

## 🎨 UI/UX 특징
- 클릭 즉시 UI 업데이트 (Optimistic Update)
- 작업 진행 중 버튼 비활성화
- 완료된 할 일은 취소선 표시
- 10% 확률로 실패하여 롤백 동작 확인 가능

## 📝 코드 하이라이트

### Optimistic Update의 핵심 패턴
```typescript
const mutation = useMutation({
  mutationFn: apiFunction,
  onMutate: async (variables) => {
    // 1. 진행 중인 refetch 취소
    await queryClient.cancelQueries({ queryKey });
    
    // 2. 이전 값 저장
    const previous = queryClient.getQueryData(queryKey);
    
    // 3. 낙관적으로 캐시 업데이트
    queryClient.setQueryData(queryKey, optimisticValue);
    
    // 4. 롤백용 컨텍스트 반환
    return { previous };
  },
  onError: (err, variables, context) => {
    // 5. 에러 시 이전 값으로 롤백
    queryClient.setQueryData(queryKey, context.previous);
  },
  onSettled: () => {
    // 6. 성공/실패 관계없이 refetch
    queryClient.invalidateQueries({ queryKey });
  },
});
```

## 🔍 테스트 시나리오
1. Todo 추가 → 즉시 리스트에 표시됨
2. Todo 완료/미완료 토글 → 즉시 체크박스 상태 변경
3. Todo 수정 → 즉시 수정된 내용 표시
4. Todo 삭제 → 즉시 리스트에서 제거
5. 실패 시 → 롤백되고 에러 메시지 표시

## 📖 참고 자료
- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [Optimistic Updates 가이드](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
