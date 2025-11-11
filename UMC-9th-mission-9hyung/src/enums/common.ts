// 1. 런타임에서 사용할 JavaScript 객체
export const PAGINATION_ORDER = {
  asc: "asc",
  desc: "desc",
} as const;

// 2. TypeScript 타입으로 사용할 String Union Type
export type PAGINATION_ORDER =
  (typeof PAGINATION_ORDER)[keyof typeof PAGINATION_ORDER];
