import { create } from 'zustand';
import type { CartItem } from '../constants/cartItems';
import cartItemsData from '../constants/cartItems';

type PlaylistState = {
  // Cart state
  cartItems: CartItem[];
  amount: number;
  total: number;

  // Modal state
  isModalOpen: boolean;

  // Cart actions
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;

  // Modal actions
  openModal: () => void;
  closeModal: () => void;
};

export const usePlaylistStore = create<PlaylistState>((set) => {
  // Helper function to calculate totals
  const computeTotals = (items: CartItem[]) => {
    let amount = 0;
    let total = 0;
    items.forEach((item) => {
      amount += item.amount;
      total += parseInt(item.price, 10) * item.amount;
    });
    return { amount, total };
  };

  return {
    // Initial state
    cartItems: cartItemsData,
    amount: 0,
    total: 0,
    isModalOpen: false,

    // Cart actions
    increase: (id: string) => {
      set((state) => {
        const updated = state.cartItems.map((item) =>
          item.id === id ? { ...item, amount: item.amount + 1 } : item
        );
        const { amount, total } = computeTotals(updated);
        return { cartItems: updated, amount, total };
      });
    },

    decrease: (id: string) => {
      set((state) => {
        const updated = state.cartItems
          .map((item) =>
            item.id === id ? { ...item, amount: item.amount - 1 } : item
          )
          .filter((item) => item.amount >= 1);
        const { amount, total } = computeTotals(updated);
        return { cartItems: updated, amount, total };
      });
    },

    removeItem: (id: string) => {
      set((state) => {
        const updated = state.cartItems.filter((item) => item.id !== id);
        const { amount, total } = computeTotals(updated);
        return { cartItems: updated, amount, total };
      });
    },

    clearCart: () => {
      set(() => ({
        cartItems: [],
        amount: 0,
        total: 0,
      }));
    },

    calculateTotals: () => {
      set((state) => {
        const { amount, total } = computeTotals(state.cartItems);
        return { amount, total };
      });
    },

    // Modal actions
    openModal: () => {
      set(() => ({ isModalOpen: true }));
    },

    closeModal: () => {
      set(() => ({ isModalOpen: false }));
    },
  };
});
