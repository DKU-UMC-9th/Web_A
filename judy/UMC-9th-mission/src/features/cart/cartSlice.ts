import { createSlice } from '@reduxjs/toolkit';
import cartItems from '../../constants/cartItems';

interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
}

// 초기 상태에서 amount와 total 계산
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

const initialState: CartState = {
  cartItems: cartItems,
  amount: totalAmount,
  total: totalPrice,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 수량 증가
    increase: (state, action) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount += 1;
      }
    },

    // 수량 감소
    decrease: (state, action) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        if (item.amount <= 1) {
          // amount가 1 이하면 아이템 제거
          state.cartItems = state.cartItems.filter(
            (cartItem) => cartItem.id !== action.payload
          );
        } else {
          item.amount -= 1;
        }
      }
    },

    // 아이템 제거
    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
    },

    // 전체 삭제
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },

    // 전체 합계 계산
    calculateTotals: (state) => {
      let totalAmount = 0;
      let totalPrice = 0;

      state.cartItems.forEach((item) => {
        totalAmount += item.amount;
        totalPrice += Number(item.price) * item.amount;
      });

      state.amount = totalAmount;
      state.total = totalPrice;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
