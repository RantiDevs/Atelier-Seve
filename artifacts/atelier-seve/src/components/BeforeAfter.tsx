import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/LanguageContext";

function Slider({ title, before, after, index }: { title: string; before: string; after: string; index: number }) {
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
        {/* After Image (Background) */}
        <div className="absolute inset-0 bg-[#1C1210]">
          <img 
            src={`/transformations/after-${index + 1}.png`} 
            alt="After" 
            className="w-full h-full object-cover" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop';
            }}
          />
          <span className="absolute top-4 right-4 font-sans text-xs uppercase tracking-widest text-white drop-shadow-md font-bold">{after}</span>
        </div>
        
        {/* Before Image (Foreground, clipped) */}
        <div
          className="absolute inset-0 bg-[#2a1a14] border-r border-[#C9A06E]"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img 
            src={`/transformations/before-${index + 1}.png`} 
            alt="Before" 
            className="w-full h-full object-cover" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop';
            }}
          />
          <span className="absolute top-4 left-4 font-sans text-xs uppercase tracking-widest text-white drop-shadow-md font-bold">{before}</span>
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
    <section id="transformations" className="w-full py-24 bg-background overflow-hidden px-4 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl italic text-foreground text-center mb-6">
          {t.beforeAfter.heading}
        </h2>
        <p className="font-sans text-muted-foreground text-center mb-16 max-w-2xl text-sm sm:text-base px-4">
          {t.beforeAfter.subheading}
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full scale-[0.9] sm:scale-100">
          {t.beforeAfter.sliders.map((title, index) => (
            <div key={title} className="relative w-full max-w-[450px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl group border border-border/10">
              <Slider title={title} before={t.beforeAfter.before} after={t.beforeAfter.after} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
