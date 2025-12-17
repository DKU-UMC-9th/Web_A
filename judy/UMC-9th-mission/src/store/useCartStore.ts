import { create } from 'zustand';
import cartItems from '../constants/cartItems';

// 타입 정의
interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

interface CartStore {
  // 장바구니 상태
  cartItems: CartItem[];
  amount: number;
  total: number;

  // 모달 상태
  isModalOpen: boolean;

  // 장바구니 액션
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;

  // 모달 액션
  openModal: () => void;
  closeModal: () => void;
}

// 초기 totals 계산
const calculateInitialTotals = (items: CartItem[]) => {
  let totalAmount = 0;
  let totalPrice = 0;

  items.forEach((item) => {
    totalAmount += item.amount;
    totalPrice += Number(item.price) * item.amount;
  });

  return { totalAmount, totalPrice };
};

const { totalAmount, totalPrice } = calculateInitialTotals(cartItems);

// Zustand 스토어 생성
export const useCartStore = create<CartStore>((set) => ({
  // 초기 상태
  cartItems: cartItems,
  amount: totalAmount,
  total: totalPrice,
  isModalOpen: false,

  // 수량 증가
  increase: (id) =>
    set((state) => {
      const updatedItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      );

      // totals 재계산
      const { totalAmount, totalPrice } = calculateInitialTotals(updatedItems);

      return {
        cartItems: updatedItems,
        amount: totalAmount,
        total: totalPrice,
      };
    }),

  // 수량 감소
  decrease: (id) =>
    set((state) => {
      const item = state.cartItems.find((item) => item.id === id);

      // amount가 1 이하면 아이템 제거
      const updatedItems =
        item && item.amount <= 1
          ? state.cartItems.filter((item) => item.id !== id)
          : state.cartItems.map((item) =>
              item.id === id ? { ...item, amount: item.amount - 1 } : item
            );

      // totals 재계산
      const { totalAmount, totalPrice } = calculateInitialTotals(updatedItems);

      return {
        cartItems: updatedItems,
        amount: totalAmount,
        total: totalPrice,
      };
    }),

  // 아이템 제거
  removeItem: (id) =>
    set((state) => {
      const updatedItems = state.cartItems.filter((item) => item.id !== id);

      // totals 재계산
      const { totalAmount, totalPrice } = calculateInitialTotals(updatedItems);

      return {
        cartItems: updatedItems,
        amount: totalAmount,
        total: totalPrice,
      };
    }),

  // 전체 삭제
  clearCart: () =>
    set({
      cartItems: [],
      amount: 0,
      total: 0,
    }),

  // 전체 합계 계산 (필요시 수동 호출)
  calculateTotals: () =>
    set((state) => {
      const { totalAmount, totalPrice } = calculateInitialTotals(
        state.cartItems
      );

      return {
        amount: totalAmount,
        total: totalPrice,
      };
    }),

  // 모달 열기
  openModal: () =>
    set({
      isModalOpen: true,
    }),

  // 모달 닫기
  closeModal: () =>
    set({
      isModalOpen: false,
    }),
}));
