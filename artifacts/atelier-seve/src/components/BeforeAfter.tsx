import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/LanguageContext";

function Slider({ title, before, after }: { title: string; before: string; after: string }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    setSliderPosition(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  };

  const handleMouseMove = (e: MouseEvent) => { if (isDragging) handleMove(e.clientX); };
  const handleTouchMove = (e: TouchEvent) => { if (isDragging) handleMove(e.touches[0].clientX); };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("mouseup", () => setIsDragging(false));
      window.addEventListener("touchend", () => setIsDragging(false));
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", () => setIsDragging(false));
      window.removeEventListener("touchend", () => setIsDragging(false));
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-serif italic text-xl text-foreground text-center">{title}</h3>
      <div
        ref={containerRef}
        className="relative w-full aspect-[3/4] overflow-hidden select-none cursor-ew-resize bg-muted rounded-md"
        onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
        onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background to-[#f0e6d2]">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjQzlBMDZFIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] mix-blend-multiply" />
          <span className="absolute top-4 right-4 font-sans text-xs uppercase tracking-widest text-border font-bold">{after}</span>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#d4cdc5] to-muted border-r border-border"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <span className="absolute top-4 left-4 font-sans text-xs uppercase tracking-widest text-foreground font-bold">{before}</span>
        </div>
        <div className="absolute top-0 bottom-0 w-0.5 bg-border pointer-events-none" style={{ left: `${sliderPosition}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-border shadow-lg flex items-center justify-center">
            <div className="w-1 h-3 bg-background mx-0.5 rounded-full" />
            <div className="w-1 h-3 bg-background mx-0.5 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BeforeAfter() {
  const { t } = useLanguage();
  return (
    <section className="w-full bg-background py-24 px-6 md:px-12 lg:px-24">
      <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-16 text-center uppercase tracking-widest">
        {t.beforeAfter.heading}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {t.beforeAfter.sliders.map((title) => (
          <Slider key={title} title={title} before={t.beforeAfter.before} after={t.beforeAfter.after} />
        ))}
      </div>
    </section>
  );
}
