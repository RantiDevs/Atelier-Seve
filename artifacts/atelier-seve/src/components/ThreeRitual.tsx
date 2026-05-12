import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LABELS = [
  { id: "deterge", text: "Deterge", color: "#1C1210" },
  { id: "nutre", text: "Nutre", color: "#1C1210" },
  { id: "illumina", text: "Illumina", color: "#1C1210" },
  { id: "protegge", text: "Protegge", color: "#1C1210" },
];

export function ThreeRitual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const dropletRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!containerRef.current) return;

    // Title fade-in on scroll
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
          },
        }
      );
    }

    // Bottle entrance
    if (bottleRef.current) {
      gsap.fromTo(
        bottleRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        }
      );
    }

    // Progress-based step activation via ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 60%",
      end: "bottom 30%",
      onUpdate: (self) => {
        const step = Math.floor(self.progress * 4) - 1;
        setActiveStep(Math.min(step, 3));

        // Cap lift
        if (capRef.current) {
          const lift = Math.min(self.progress * 6, 1);
          capRef.current.style.transform = `translateY(${-lift * 48}px)`;
        }

        // Droplet float
        if (dropletRef.current) {
          const floatProgress = Math.max(0, self.progress * 6 - 2);
          const floatClamped = Math.min(floatProgress, 1);
          dropletRef.current.style.transform = `translateY(${-floatClamped * 80}px) scale(${1 + floatClamped * 0.3})`;
          dropletRef.current.style.opacity = `${0.3 + floatClamped * 0.7}`;
        }
      },
    });

    // Background color shift
    gsap.to(containerRef.current, {
      backgroundColor: "#E8C4B8",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        end: "bottom 30%",
        scrub: true,
      },
    });

    return () => {
      trigger.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-32 overflow-hidden"
      style={{ backgroundColor: "#F9F4EE", minHeight: "100vh" }}
    >
      {/* Title */}
      <h2
        ref={titleRef}
        className="font-serif text-4xl md:text-6xl italic text-center mb-24 opacity-0"
        style={{ color: "#1C1210" }}
      >
        Il Nostro Rituale
      </h2>

      <div className="flex flex-col items-center justify-center gap-16 px-6">
        {/* CSS Bottle */}
        <div
          ref={bottleRef}
          className="relative flex flex-col items-center opacity-0"
          style={{ height: "280px", width: "120px" }}
        >
          {/* Cap */}
          <div
            ref={capRef}
            className="relative z-20 transition-none"
            style={{
              width: "76px",
              height: "36px",
              backgroundColor: "#F9F4EE",
              borderRadius: "12px 12px 0 0",
              boxShadow: "0 -2px 16px rgba(201,160,110,0.25), inset 0 1px 0 rgba(255,255,255,0.6)",
              border: "1px solid rgba(201,160,110,0.3)",
              transition: "transform 0.1s linear",
            }}
          />

          {/* Bottle body */}
          <div
            className="relative z-10 flex items-center justify-center overflow-hidden"
            style={{
              width: "72px",
              height: "200px",
              borderRadius: "4px 4px 20px 20px",
              background: "linear-gradient(160deg, rgba(249,244,238,0.85) 0%, rgba(232,196,184,0.6) 40%, rgba(158,123,123,0.3) 100%)",
              border: "1px solid rgba(201,160,110,0.35)",
              backdropFilter: "blur(8px)",
              boxShadow: "inset 12px 0 20px rgba(255,255,255,0.4), 0 8px 40px rgba(201,160,110,0.2)",
            }}
          >
            {/* Glass shimmer */}
            <div
              className="absolute top-4 left-3"
              style={{
                width: "12px",
                height: "80px",
                borderRadius: "6px",
                background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, transparent 100%)",
                transform: "skewX(-8deg)",
              }}
            />
            {/* Label area */}
            <div
              className="absolute inset-x-3 top-1/2 -translate-y-1/2 text-center"
              style={{ color: "rgba(28,18,16,0.35)", fontSize: "8px", letterSpacing: "0.15em", fontFamily: "serif", fontStyle: "italic" }}
            >
              Atelier<br />Sève
            </div>
          </div>

          {/* Droplet */}
          <div
            ref={dropletRef}
            className="absolute z-30"
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50% 50% 50% 0",
              backgroundColor: "#C9A06E",
              transform: "rotate(-45deg)",
              bottom: "80px",
              left: "50%",
              marginLeft: "-10px",
              opacity: 0.3,
              boxShadow: "0 0 16px rgba(201,160,110,0.6)",
              transition: "transform 0.1s linear, opacity 0.1s linear",
            }}
          />
        </div>

        {/* Labels — step by step reveal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-3xl">
          {LABELS.map((label, i) => (
            <div
              key={label.id}
              className="flex flex-col items-center gap-3 transition-all duration-500"
              style={{
                opacity: activeStep >= i ? 1 : 0.15,
                transform: activeStep >= i ? "translateY(0)" : "translateY(16px)",
              }}
            >
              {/* Step indicator */}
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
              <span
                className="font-serif italic text-2xl md:text-3xl"
                style={{ color: label.color }}
              >
                {label.text}
              </span>
              <div
                className="w-8 h-[1px]"
                style={{
                  backgroundColor: "#C9A06E",
                  opacity: activeStep >= i ? 0.6 : 0,
                  transition: "opacity 0.5s ease 0.2s",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Decorative bottom arc */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(232,196,184,0.3))",
        }}
      />
    </section>
  );
}
