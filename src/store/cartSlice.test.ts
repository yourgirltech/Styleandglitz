import cartReducer, { addToCart, removeFromCart, setQuantity, clearCart } from "./cartSlice";

describe("cartSlice", () => {
  const initialState = { lines: [] };

  it("adds a new product to an empty cart", () => {
    const state = cartReducer(initialState, addToCart({ productId: "w-1" }));
    expect(state.lines).toEqual([{ productId: "w-1", quantity: 1 }]);
  });

  it("increases quantity when adding a product already in the cart", () => {
    const state = cartReducer(
      { lines: [{ productId: "w-1", quantity: 1 }] },
      addToCart({ productId: "w-1", quantity: 2 })
    );
    expect(state.lines).toEqual([{ productId: "w-1", quantity: 3 }]);
  });

  it("removes a product entirely", () => {
    const state = cartReducer(
      { lines: [{ productId: "w-1", quantity: 1 }, { productId: "m-1", quantity: 2 }] },
      removeFromCart("w-1")
    );
    expect(state.lines).toEqual([{ productId: "m-1", quantity: 2 }]);
  });

  it("updates quantity directly", () => {
    const state = cartReducer(
      { lines: [{ productId: "w-1", quantity: 1 }] },
      setQuantity({ productId: "w-1", quantity: 5 })
    );
    expect(state.lines).toEqual([{ productId: "w-1", quantity: 5 }]);
  });

  it("removes the line entirely if quantity is set to 0 or below", () => {
    const state = cartReducer(
      { lines: [{ productId: "w-1", quantity: 1 }] },
      setQuantity({ productId: "w-1", quantity: 0 })
    );
    expect(state.lines).toEqual([]);
  });

  it("clears the entire cart", () => {
    const state = cartReducer(
      { lines: [{ productId: "w-1", quantity: 1 }, { productId: "m-1", quantity: 2 }] },
      clearCart()
    );
    expect(state.lines).toEqual([]);
  });
});