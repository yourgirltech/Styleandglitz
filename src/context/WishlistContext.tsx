import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleWishlist as toggleWishlistAction } from "@/store/wishlistSlice";

export function useWishlist() {
  const dispatch = useAppDispatch();
  const productIds = useAppSelector((state) => state.wishlist.productIds);

  const toggleWishlist = (productId: string) => dispatch(toggleWishlistAction(productId));
  const isWishlisted = (productId: string) => productIds.includes(productId);

  return { productIds, toggleWishlist, isWishlisted };
}