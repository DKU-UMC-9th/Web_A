import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import cartItemsImport from '../../constants/cartItems';
import type { CartItem } from '../../constants/cartItems';

type CartState = {
  cartItems: CartItem[];
  amount: number;
  total: number;
};

const initialState: CartState = {
  cartItems: cartItemsImport,
  amount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    calculateTotals(state: CartState) {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += parseInt(item.price, 10) * item.amount;
      });
      state.amount = amount;
      state.total = total;
    },
    increase(state: CartState, action: PayloadAction<string>) {
      const id = action.payload;
      const item = state.cartItems.find((i) => i.id === id);
      if (item) {
        item.amount += 1;
      }
      // update totals
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((it) => {
        amount += it.amount;
        total += parseInt(it.price, 10) * it.amount;
      });
      state.amount = amount;
      state.total = total;
    },
    decrease(state: CartState, action: PayloadAction<string>) {
      const id = action.payload;
      const itemIndex = state.cartItems.findIndex((i) => i.id === id);
      if (itemIndex !== -1) {
        const item = state.cartItems[itemIndex];
        item.amount -= 1;
        if (item.amount < 1) {
          state.cartItems.splice(itemIndex, 1);
        }
      }
      // update totals
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((it) => {
        amount += it.amount;
        total += parseInt(it.price, 10) * it.amount;
      });
      state.amount = amount;
      state.total = total;
    },
    removeItem(state: CartState, action: PayloadAction<string>) {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((i) => i.id !== id);
      // update totals
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((it) => {
        amount += it.amount;
        total += parseInt(it.price, 10) * it.amount;
      });
      state.amount = amount;
      state.total = total;
    },
    clearCart(state: CartState) {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
  },
});

export const { calculateTotals, increase, decrease, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
