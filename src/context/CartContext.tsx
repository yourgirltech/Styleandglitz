import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  setQuantity as setQuantityAction,
  clearCart as clearCartAction,
} from "@/store/cartSlice";
import { useProducts } from "@/context/ProductsContext";

export function useCart() {
  const dispatch = useAppDispatch();
  const lines = useAppSelector((state) => state.cart.lines);
  const { getById } = useProducts();

  const addToCart = (productId: string, quantity = 1) =>
    dispatch(addToCartAction({ productId, quantity }));
  const removeFromCart = (productId: string) => dispatch(removeFromCartAction(productId));
  const setQuantity = (productId: string, quantity: number) =>
    dispatch(setQuantityAction({ productId, quantity }));
  const clearCart = () => dispatch(clearCartAction());

  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);
  const subtotal = useMemo(
    () =>
      lines.reduce((sum, l) => {
        const product = getById(l.productId);
        return sum + (product ? product.price * l.quantity : 0);
      }, 0),
    [lines, getById]
  );

  return { lines, addToCart, removeFromCart, setQuantity, clearCart, itemCount, subtotal };
}