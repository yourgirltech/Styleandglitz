import wishlistReducer, { toggleWishlist } from "./wishlistSlice";

describe("wishlistSlice", () => {
  it("adds a product id when it's not already wishlisted", () => {
    const state = wishlistReducer({ productIds: [] }, toggleWishlist("w-1"));
    expect(state.productIds).toEqual(["w-1"]);
  });

  it("removes a product id when it's already wishlisted (toggling off)", () => {
    const state = wishlistReducer({ productIds: ["w-1", "m-1"] }, toggleWishlist("w-1"));
    expect(state.productIds).toEqual(["m-1"]);
  });

  it("doesn't affect other product ids when toggling one", () => {
    const state = wishlistReducer({ productIds: ["w-1"] }, toggleWishlist("m-1"));
    expect(state.productIds).toEqual(["w-1", "m-1"]);
  });
});