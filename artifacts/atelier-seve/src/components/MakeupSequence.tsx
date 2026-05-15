import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export function MakeupSequence() {
  const { t } = useLanguage();
  const ms = t.makeupSequence;
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=1500",
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          setStep(Math.min(Math.floor(self.progress * ms.steps.length), ms.steps.length - 1));
        },
      });
    });
    return () => ctx.revert();
  }, [ms]);

  return (
    <section
      ref={containerRef}
      className="w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#1C1210" }}
    >
      <h2
        className="font-serif text-3xl sm:text-4xl md:text-6xl italic text-center mb-8 md:mb-12"
        style={{ color: "#F9F4EE" }}
      >
        {ms.heading}
      </h2>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 w-full max-w-5xl scale-[0.85] sm:scale-100">
        <div className="relative" style={{ width: "240px", height: "300px", flexShrink: 0 }}>
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-[rgba(201,160,110,0.25)] bg-[#1C1210]">
            {ms.steps.map((_, i) => (
              <img
                key={i}
                src={
                  [
                    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop", // Bare skin / Prep
                    "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800&auto=format&fit=crop", // Foundation
                    "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop", // Blush/Warmth
                    "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=800&auto=format&fit=crop", // Eyeliner
                    "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop", // Lips
                  ][i] || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop"
                }
                alt={`Step ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                style={{ opacity: step === i ? 1 : 0 }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1210] to-transparent opacity-60 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-5 w-full max-w-xs">
          {ms.steps.map((label, i) => (
            <div
              key={i}
              className="flex items-center gap-6 px-6 py-5 rounded-2xl transition-all duration-500"
              style={{
                backgroundColor: step >= i ? "rgba(201,160,110,0.15)" : "transparent",
                border: `1px solid ${step >= i ? "rgba(201,160,110,0.4)" : "rgba(201,160,110,0.1)"}`,
                transform: step === i ? "translateX(10px)" : "translateX(0)",
                opacity: step >= i ? 1 : 0.25,
              }}
            >
              <div
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-sans shrink-0 transition-all duration-500"
                style={{
                  backgroundColor: step >= i ? "#C9A06E" : "transparent",
                  border: `1px solid ${step >= i ? "#C9A06E" : "rgba(201,160,110,0.3)"}`,
                  color: step >= i ? "#1C1210" : "#C9A06E",
                  boxShadow: step === i ? "0 0 20px rgba(201,160,110,0.4)" : "none",
                }}
              >
                {i + 1}
              </div>
              <span
                className="font-serif italic text-lg md:text-2xl"
                style={{ color: step >= i ? "#F9F4EE" : "#9E7B7B" }}
              >
                {label}
              </span>
              {step === i && (
                <div className="ml-auto w-2 h-2 rounded-full bg-[#C9A06E] animate-ping" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
