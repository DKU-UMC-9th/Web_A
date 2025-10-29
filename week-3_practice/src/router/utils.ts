// src/router/utils.ts
export const navigateTo = (to: string) => {
    window.history.pushState(null, '', to);
    // URL이 변경되었음을 알리는 커스텀 이벤트를 발생시켜 Router가 감지하게 함
    window.dispatchEvent(new PopStateEvent('popstate')); 
};

export const getCurrentPath = (): string => {
    return window.location.pathname;
};