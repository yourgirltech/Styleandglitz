import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartLine } from "@/types/product";

interface CartState {
  lines: CartLine[];
}

const initialState: CartState = { lines: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ productId: string; quantity?: number }>) => {
      const { productId, quantity = 1 } = action.payload;
      const existing = state.lines.find((l) => l.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.lines.push({ productId, quantity });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.lines = state.lines.filter((l) => l.productId !== action.payload);
    },
    setQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.lines = state.lines.filter((l) => l.productId !== productId);
        return;
      }
      const line = state.lines.find((l) => l.productId === productId);
      if (line) line.quantity = quantity;
    },
    clearCart: (state) => {
      state.lines = [];
    },
  },
});

export const { addToCart, removeFromCart, setQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;