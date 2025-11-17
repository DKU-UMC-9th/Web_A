# MyPage.tsx 업데이트 필요

구글 로그인 후 바로 `/my`로 리다이렉트되기 때문에, `MyPage` 컴포넌트에서도 `localStorage`의 `redirectAfterLogin`을 확인해야 합니다.

## 수정 필요 사항:

`MyPage.tsx`의 `useEffect`에 다음 로직 추가:
1. 컴포넌트 마운트 시 `localStorage.getItem('redirectAfterLogin')` 확인
2. 값이 있으면 해당 경로로 `navigate`
3. `localStorage.removeItem('redirectAfterLogin')` 실행

## 예시 코드:

```tsx
useEffect(() => {
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath && redirectPath !== 'null' && redirectPath !== 'undefined') {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath, { replace: true });
    }
}, [navigate]);
```
