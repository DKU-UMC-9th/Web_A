# 📝 Week 7 Mission - useMutation & Optimistic Updates

## 미션 개요

**목표**: React Query의 `useMutation`과 낙관적 업데이트(Optimistic Update)를 활용하여 빠르고 반응적인 Todo List 애플리케이션 구현

## 🎓 학습 내용

### 1. useMutation이란?

React Query의 `useMutation`은 서버의 데이터를 생성(Create), 수정(Update), 삭제(Delete)하는 **변경 작업**을 쉽게 관리할 수 있게 해주는 훅입니다.

#### 기본 사용법
```typescript
const mutation = useMutation({
  mutationFn: (data) => api.createTodo(data),
  onSuccess: () => {
    // 성공 시 실행
  },
  onError: (error) => {
    // 에러 시 실행
  }
});

// 사용
mutation.mutate({ title: '새로운 할 일' });
```

### 2. Optimistic Update란?

낙관적 업데이트는 **서버 응답을 기다리지 않고** 즉시 UI를 업데이트하는 기법입니다.

#### 왜 사용할까?
- ⚡ **즉각적인 사용자 경험**: 네트워크 지연을 느끼지 못함
- 🚀 **빠른 UI 반응**: 클릭과 동시에 변경사항 반영
- 💪 **안전성**: 실패 시 자동으로 이전 상태로 복구

#### 동작 원리
```
1. 사용자 클릭
   ↓
2. 즉시 UI 업데이트 (낙관적)
   ↓
3. 서버에 요청 전송
   ↓
4-A. 성공: 그대로 유지
4-B. 실패: 이전 상태로 롤백
```

## 🔧 구현 상세

### onMutate: 낙관적 업데이트 시작

```typescript
onMutate: async (newTodo) => {
  // 1. 진행 중인 refetch 취소 (충돌 방지)
  await queryClient.cancelQueries({ queryKey: ['todos'] });

  // 2. 이전 데이터 백업 (롤백용)
  const previousTodos = queryClient.getQueryData(['todos']);

  // 3. 즉시 UI 업데이트 (낙관적)
  queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);

  // 4. 롤백을 위한 컨텍스트 반환
  return { previousTodos };
}
```

### onError: 실패 시 롤백

```typescript
onError: (err, newTodo, context) => {
  // 이전 상태로 복구
  queryClient.setQueryData(['todos'], context.previousTodos);
  // 사용자에게 에러 알림
  alert('작업 실패!');
}
```

### onSettled: 최종 동기화

```typescript
onSettled: () => {
  // 성공/실패 관계없이 서버 데이터로 최종 동기화
  queryClient.invalidateQueries({ queryKey: ['todos'] });
}
```

## 📊 실제 동작 예시

### 시나리오 1: Todo 추가 (성공)
```
1. "React 학습하기" 입력 후 추가 버튼 클릭
2. 즉시 리스트에 "React 학습하기" 표시 ⚡
3. 800ms 후 서버 응답 도착
4. 성공 → 그대로 유지
```

### 시나리오 2: Todo 완료 토글 (실패)
```
1. 체크박스 클릭
2. 즉시 체크 표시 + 취소선 적용 ⚡
3. 600ms 후 서버 응답 도착
4. 실패 (10% 확률) → 자동으로 체크 해제 + 알림 표시
```

## 🎯 핵심 포인트

### ✅ Do (해야 할 것)
- **항상** `cancelQueries`로 진행 중인 쿼리 취소
- **반드시** 이전 데이터 백업
- **꼭** `onError`에서 롤백 구현
- **필수** `onSettled`에서 최종 동기화

### ❌ Don't (하지 말아야 할 것)
- 낙관적 업데이트 없이 `setQueryData`만 사용
- 롤백 로직 없이 optimistic update 구현
- `invalidateQueries` 없이 종료

## 🚀 프로젝트 실행

### 설치
```bash
cd week7-mission
npm install
```

### 개발 서버
```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 빌드
```bash
npm run build
```

## 🧪 테스트 방법

1. **추가 테스트**
   - 새로운 할 일 입력 → 즉시 리스트에 추가되는지 확인

2. **완료 테스트**
   - 체크박스 클릭 → 즉시 취소선 표시되는지 확인

3. **수정 테스트**
   - 수정 버튼 → 내용 변경 → 저장 → 즉시 반영되는지 확인

4. **삭제 테스트**
   - 삭제 버튼 → 즉시 리스트에서 제거되는지 확인

5. **롤백 테스트**
   - 여러 번 시도하여 10% 실패 케이스 확인
   - 실패 시 이전 상태로 복구되는지 확인

## 📚 참고 자료

- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [useMutation 가이드](https://tanstack.com/query/latest/docs/react/guides/mutations)
- [Optimistic Updates 가이드](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)

## 💡 배운 점 정리

1. **useMutation**은 서버 상태 변경을 선언적으로 관리
2. **Optimistic Update**로 사용자 경험 대폭 개선
3. **에러 처리**와 **롤백**으로 안전성 확보
4. **QueryClient**를 통한 캐시 제어의 중요성

## 🎉 다음 단계

- React Query DevTools 추가
- 실제 백엔드 API 연동
- 페이지네이션 구현
- 무한 스크롤 적용
- 여러 mutation 동시 처리

---

**제작**: Week 7 Mission - DKU UMC Web Study Group A
