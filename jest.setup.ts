import "@testing-library/jest-dom";

if (typeof Element !== "undefined" && !Element.prototype.animate) {
  Element.prototype.animate = jest.fn().mockReturnValue({
    onfinish: null,
    cancel: jest.fn(),
    finish: jest.fn(),
  }) as unknown as Element["animate"];
}