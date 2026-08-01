import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "./ProductCard";
import { ProductsProvider } from "@/context/ProductsContext";
import { CartFXProvider } from "@/context/CartFXContext";
import cartReducer from "@/store/cartSlice";
import wishlistReducer from "@/store/wishlistSlice";
import type { Product } from "@/types/product";


jest.mock("@/lib/supabase", () => ({ supabase: null }));

const mockProduct: Product = {
  id: "w-test-1",
  slug: "test-watch",
  name: "Test Watch",
  brandLine: "Test Brand",
  category: "watches",
  subCategory: "Rolex Inspired",
  price: 100000,
  rating: 4.8,
  reviewCount: 12,
  description: "A watch used only for testing.",
  materials: ["Stainless steel"],
  features: ["Automatic movement"],
  image: "/test-image.jpeg",
  video: "/test-video.mp4",
  stock: 5,
};

function renderWithProviders(ui: React.ReactElement) {
  const store = configureStore({
    reducer: { cart: cartReducer, wishlist: wishlistReducer },
  });

  render(
    <MemoryRouter>
      <Provider store={store}>
        <ProductsProvider>
          <CartFXProvider>{ui}</CartFXProvider>
        </ProductsProvider>
      </Provider>
    </MemoryRouter>
  );

  return store;
}

describe("ProductCard", () => {
  it("renders the product name and price", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test Watch")).toBeInTheDocument();
  });

  it("adds the product to the cart when 'Add to Cart' is clicked", () => {
    const store = renderWithProviders(<ProductCard product={mockProduct} />);

    expect(store.getState().cart.lines).toEqual([]);

    fireEvent.click(screen.getByText("Add to Cart"));

    expect(store.getState().cart.lines).toEqual([{ productId: "w-test-1", quantity: 1 }]);
  });

  it("toggles the wishlist when the heart button is clicked", () => {
    const store = renderWithProviders(<ProductCard product={mockProduct} />);

    expect(store.getState().wishlist.productIds).toEqual([]);

    fireEvent.click(screen.getByLabelText("Toggle wishlist"));
    expect(store.getState().wishlist.productIds).toEqual(["w-test-1"]);

    fireEvent.click(screen.getByLabelText("Toggle wishlist"));
    expect(store.getState().wishlist.productIds).toEqual([]);
  });
});