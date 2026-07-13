import { useEffect, useRef } from "react";
import { useCartFX } from "@/context/CartFXContext";

interface FlyItem {
  id: number;
  startX: number;
  startY: number;
  midX: number;
  midY: number;
  endX: number;
  endY: number;
  image: string;
}

export default function CartFXOverlay() {
  const { flyingItems, sparkles, toast } = useCartFX();

  return (
    <>
      {flyingItems.map((item) => (
        <FlyingThumb key={item.id} item={item} />
      ))}
      {sparkles.map((s) => (
        <Sparkle key={s.id} x={s.x} y={s.y} />
      ))}
      <div
        className={`fixed left-1/2 bottom-8 z-[210] -translate-x-1/2 flex items-center gap-3 bg-forest text-cream border border-gold/40 px-5 py-3 transition-all duration-300 ease-out ${
          toast.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <CheckMark active={toast.visible} />
        <span className="text-xs eyebrow">
          Added — <span className="text-gold">{toast.productName}</span>
        </span>
      </div>
    </>
  );
}

function FlyingThumb({ item }: { item: FlyItem }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const steps = 24;
    const frames: Keyframe[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = (1 - t) * (1 - t) * item.startX + 2 * (1 - t) * t * item.midX + t * t * item.endX;
      const y = (1 - t) * (1 - t) * item.startY + 2 * (1 - t) * t * item.midY + t * t * item.endY;
      frames.push({
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%) scale(${1 - t * 0.6})`,
        opacity: t > 0.8 ? `${1 - (t - 0.8) / 0.2}` : "1",
      });
    }
    el.animate(frames, { duration: 680, easing: "cubic-bezier(0.3,0.6,0.4,1)", fill: "forwards" });
  }, [item]);

  return (
    <div
      ref={ref}
      className="fixed w-10 h-10 rounded-full overflow-hidden border border-gold/60 z-[200] pointer-events-none"
      style={{ left: item.startX, top: item.startY }}
    >
      <img src={item.image} alt="" className="w-full h-full object-cover" />
    </div>
  );
}

function Sparkle({ x, y }: { x: number; y: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 40;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 10;
    el.animate(
      [
        { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3)`, opacity: 0 },
      ],
      { duration: 750 + Math.random() * 200, easing: "cubic-bezier(0.25,0.46,0.45,0.94)", fill: "forwards" }
    );
  }, []);
  return (
    <div
      ref={ref}
      className="fixed w-1.5 h-1.5 bg-gold z-[199] pointer-events-none"
      style={{ left: x, top: y }}
    />
  );
}

function CheckMark({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0">
      <circle cx="8" cy="8" r="7" fill="none" stroke="#C9A227" strokeWidth="1.3" />
      <path
        d="M4.5 8.2L6.8 10.5L11.5 5.5"
        fill="none"
        stroke="#C9A227"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="12"
        strokeDashoffset={active ? 0 : 12}
        style={{ transition: "stroke-dashoffset 320ms ease-out 120ms" }}
      />
    </svg>
  );
}