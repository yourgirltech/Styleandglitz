import { createContext, useContext, useCallback, useRef, useState, type ReactNode } from "react";

interface FlyingItem {
  id: number;
  startX: number;
  startY: number;
  midX: number;
  midY: number;
  endX: number;
  endY: number;
  image: string;
}

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
}

interface ToastState {
  visible: boolean;
  productName: string;
}

interface CartFXContextValue {
  cartIconRef: React.RefObject<HTMLDivElement>;
  flyingItems: FlyingItem[];
  sparkles: SparkleParticle[];
  toast: ToastState;
  bounceKey: number;
  triggerAddToCartFX: (originEl: HTMLElement, image: string, productName: string) => void;
}

const CartFXContext = createContext<CartFXContextValue | undefined>(undefined);
let uid = 0;

export function CartFXProvider({ children }: { children: ReactNode }) {
  const cartIconRef = useRef<HTMLDivElement>(null);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);
  const [bounceKey, setBounceKey] = useState(0);
  const [toast, setToast] = useState<ToastState>({ visible: false, productName: "" });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerAddToCartFX = useCallback((originEl: HTMLElement, image: string, productName: string) => {
    const cartEl = cartIconRef.current;
    if (!cartEl) return;

    const originRect = originEl.getBoundingClientRect();
    const cartRect = cartEl.getBoundingClientRect();

    const startX = originRect.left + originRect.width / 2;
    const startY = originRect.top + originRect.height / 2;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;
    const midX = (startX + endX) / 2;
    const midY = Math.min(startY, endY) - 90;

    const id = ++uid;
    setFlyingItems((prev) => [...prev, { id, startX, startY, midX, midY, endX, endY, image }]);

    const newSparkles: SparkleParticle[] = Array.from({ length: 6 }).map(() => ({
      id: ++uid,
      x: startX,
      y: startY,
    }));
    setSparkles((prev) => [...prev, ...newSparkles]);

    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newSparkles.some((n) => n.id === s.id)));
    }, 850);

    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((f) => f.id !== id));
      setBounceKey((k) => k + 1);
      setToast({ visible: true, productName });
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast({ visible: false, productName: "" }), 2200);
    }, 680);
  }, []);

  return (
    <CartFXContext.Provider
      value={{ cartIconRef, flyingItems, sparkles, toast, bounceKey, triggerAddToCartFX }}
    >
      {children}
    </CartFXContext.Provider>
  );
}

export function useCartFX() {
  const ctx = useContext(CartFXContext);
  if (!ctx) throw new Error("useCartFX must be used within a CartFXProvider");
  return ctx;
}