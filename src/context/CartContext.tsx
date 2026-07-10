import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { CartLine } from "@/types/product";
import { useProducts } from "@/context/ProductsContext";

interface CartContextValue {
  lines: CartLine[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { getById } = useProducts();
  const [lines, setLines] = useState<CartLine[]>([]);

  const addToCart = (productId: string, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  };

  const setQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setLines((prev) => prev.map((l) => (l.productId === productId ? { ...l, quantity } : l)));
  };

  const clearCart = () => setLines([]);

  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  const subtotal = useMemo(
    () =>
      lines.reduce((sum, l) => {
        const product = getById(l.productId);
        return sum + (product ? product.price * l.quantity : 0);
      }, 0),
    [lines, getById]
  );

  return (
    <CartContext.Provider
      value={{ lines, addToCart, removeFromCart, setQuantity, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}