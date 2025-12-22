import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cartItems from "../constants/cartitems";
import type { CartItems, Lp } from "../types/cart";

export interface CastState {
    cartItems: CartItems;
    amount: number;
    total: number;
}

const initialState: CastState = {
    cartItems: cartItems,
    amount: 0,
    total: 0,
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // todo 증가
        increase: (state: CastState, action: PayloadAction<{ id: string }>) => {
            const itemId = action.payload.id;

            const item = state.cartItems.find((cartItem: Lp) => cartItem.id === itemId);

            if (item) {
                item.amount += 1;
            }
        },

        // todo 감소
        decrease: (state: CastState, action: PayloadAction<{ id: string }>) => {
            const itemId = action.payload.id;

            const item = state.cartItems.find((cartItem: Lp) => cartItem.id === itemId);

            if (item) {
                item.amount -= 1;
            }
        },

        // todo removeItem 아이템 제거
        removeItem: (state: CastState, action: PayloadAction<{ id: string }>) => {
            const itemId = action.payload.id;
            state.cartItems = state.cartItems.filter((cartItem: Lp) => cartItem.id !== itemId);
        },

        // todo clearCart 장바구니 비우기
        clearCart: (state: CastState) => {
            state.cartItems = [];
        },

        // todo 총액 계산
        calculateTotal: (state: CastState) => {
            let amount = 0;
            let total = 0;

            state.cartItems.forEach((item: Lp) => {
                amount += item.amount;
                total += item.amount * parseInt(item.price);
            })

            state.amount = amount;
            state.total = total;
        }
    }
})

export const { increase, decrease, removeItem, clearCart, calculateTotal } = cartSlice.actions

const cartReducer = cartSlice.reducer
export default cartReducer