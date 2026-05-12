import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export function ThreeRitual() {
  const { lang, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const dropletRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!containerRef.current) return;

    if (titleRef.current) {
      gsap.fromTo(titleRef.current, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
      });
    }
    if (bottleRef.current) {
      gsap.fromTo(bottleRef.current, { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 70%" },
      });
    }

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 60%",
      end: "bottom 30%",
      onUpdate: (self) => {
        setActiveStep(Math.min(Math.floor(self.progress * 4) - 1, 3));
        if (capRef.current) {
          capRef.current.style.transform = `translateY(${-Math.min(self.progress * 6, 1) * 48}px)`;
        }
        if (dropletRef.current) {
          const fp = Math.min(Math.max(0, self.progress * 6 - 2), 1);
          dropletRef.current.style.transform = `translateY(${-fp * 80}px) scale(${1 + fp * 0.3})`;
          dropletRef.current.style.opacity = `${0.3 + fp * 0.7}`;
        }
      },
    });

    gsap.to(containerRef.current, {
      backgroundColor: "#E8C4B8",
      scrollTrigger: { trigger: containerRef.current, start: "top 60%", end: "bottom 30%", scrub: true },
    });

    return () => { trigger.kill(); ScrollTrigger.getAll().forEach((s) => s.kill()); };
  }, [lang]);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-32 overflow-hidden"
      style={{ backgroundColor: "#F9F4EE", minHeight: "100vh" }}
    >
      <h2
        ref={titleRef}
        className="font-serif text-4xl md:text-6xl italic text-center mb-24 opacity-0"
        style={{ color: "#1C1210" }}
      >
        {t.ritual.heading}
      </h2>

      <div className="flex flex-col items-center justify-center gap-16 px-6">
        <div ref={bottleRef} className="relative flex flex-col items-center opacity-0" style={{ height: "280px", width: "120px" }}>
          <div
            ref={capRef}
            className="relative z-20"
            style={{
              width: "76px", height: "36px", backgroundColor: "#F9F4EE",
              borderRadius: "12px 12px 0 0",
              boxShadow: "0 -2px 16px rgba(201,160,110,0.25), inset 0 1px 0 rgba(255,255,255,0.6)",
              border: "1px solid rgba(201,160,110,0.3)",
              transition: "transform 0.1s linear",
            }}
          />
          <div
            className="relative z-10 flex items-center justify-center overflow-hidden"
            style={{
              width: "72px", height: "200px", borderRadius: "4px 4px 20px 20px",
              background: "linear-gradient(160deg, rgba(249,244,238,0.85) 0%, rgba(232,196,184,0.6) 40%, rgba(158,123,123,0.3) 100%)",
              border: "1px solid rgba(201,160,110,0.35)",
              backdropFilter: "blur(8px)",
              boxShadow: "inset 12px 0 20px rgba(255,255,255,0.4), 0 8px 40px rgba(201,160,110,0.2)",
            }}
          >
            <div
              className="absolute top-4 left-3"
              style={{ width: "12px", height: "80px", borderRadius: "6px", background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, transparent 100%)", transform: "skewX(-8deg)" }}
            />
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 text-center" style={{ color: "rgba(28,18,16,0.35)", fontSize: "8px", letterSpacing: "0.15em", fontFamily: "serif", fontStyle: "italic" }}>
              Atelier<br />Sève
            </div>
          </div>
          <div
            ref={dropletRef}
            className="absolute z-30"
            style={{
              width: "20px", height: "20px", borderRadius: "50% 50% 50% 0",
              backgroundColor: "#C9A06E", transform: "rotate(-45deg)",
              bottom: "80px", left: "50%", marginLeft: "-10px",
              opacity: 0.3, boxShadow: "0 0 16px rgba(201,160,110,0.6)",
              transition: "transform 0.1s linear, opacity 0.1s linear",
            }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-3xl">
          {t.ritual.steps.map((label, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 transition-all duration-500"
              style={{ opacity: activeStep >= i ? 1 : 0.15, transform: activeStep >= i ? "translateY(0)" : "translateY(16px)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans"
                style={{
                  backgroundColor: activeStep >= i ? "#C9A06E" : "transparent",
                  border: `1px solid ${activeStep >= i ? "#C9A06E" : "#9E7B7B55"}`,
                  color: activeStep >= i ? "#F9F4EE" : "#9E7B7B",
                  transition: "all 0.5s ease",
                }}
              >
                {i + 1}
              </div>
              <span className="font-serif italic text-2xl md:text-3xl" style={{ color: "#1C1210" }}>{label}</span>
              <div className="w-8 h-[1px]" style={{ backgroundColor: "#C9A06E", opacity: activeStep >= i ? 0.6 : 0, transition: "opacity 0.5s ease 0.2s" }} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, rgba(232,196,184,0.3))" }} />
    </section>
  );
}
