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

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
        });
      }

      // Main pinning timeline
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=1500",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            setActiveStep(Math.min(Math.floor(self.progress * 4), 3));
          }
        }
      });

      // Animate lid
      mainTl.to(capRef.current, {
        rotateX: -110,
        ease: "none"
      }, 0);

      // Animate puff
      mainTl.fromTo(dropletRef.current, 
        { y: 0, opacity: 0, scale: 0.8 },
        { y: -60, opacity: 1, scale: 1.2, ease: "power2.out" },
        0.3
      );

      // Background color change
      mainTl.to(containerRef.current, {
        backgroundColor: "#E8C4B8",
        ease: "none"
      }, 0);
    });

    return () => ctx.revert();
  }, [lang]);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-32 overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: "#F9F4EE", minHeight: "100vh" }}
    >
      <h2
        ref={titleRef}
        className="font-serif text-3xl sm:text-4xl md:text-6xl italic text-center mb-16 md:mb-24 opacity-0 px-4"
        style={{ color: "#1C1210" }}
      >
        {t.ritual.heading}
      </h2>

      <div className="flex flex-col items-center justify-center gap-12 md:gap-16 px-6 w-full max-w-5xl mx-auto scale-[0.8] sm:scale-100">
        <div ref={bottleRef} className="relative flex flex-col items-center" style={{ perspective: "1000px", width: "200px", height: "200px" }}>
          {/* Box Base */}
          <div
            className="absolute bottom-0 w-full"
            style={{
              height: "50px",
              backgroundColor: "#2a1a14",
              borderRadius: "20px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)",
              border: "1px solid #3a2818",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Inside Powder */}
            <div
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[1px]"
              style={{
                width: "150px", height: "150px",
                backgroundColor: "#e0b898",
                borderRadius: "50%",
                transform: "rotateX(90deg)",
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.2)",
              }}
            />
          </div>

          {/* Box Lid */}
          <div
            ref={capRef}
            className="absolute bottom-[50px] w-full"
            style={{
              height: "180px",
              backgroundColor: "#1a0e0a",
              borderRadius: "20px",
              transformOrigin: "bottom center",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2), 0 -10px 30px rgba(201,160,110,0.15)",
              border: "1px solid #3a2818",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Mirror inside lid */}
            <div
              className="absolute inset-5 rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)",
                backdropFilter: "blur(4px)",
                border: "2px solid #C9A06E",
                transform: "translateZ(1px)",
              }}
            />
          </div>
          
          {/* Puff emerging */}
          <div
            ref={dropletRef}
            className="absolute z-30"
            style={{
              width: "120px", height: "120px", borderRadius: "50%",
              backgroundColor: "#F9F4EE",
              bottom: "50px", left: "50%", marginLeft: "-60px",
              opacity: 0, boxShadow: "0 15px 30px rgba(0,0,0,0.3), inset 0 -10px 30px rgba(0,0,0,0.1)",
              display: "flex", alignItems: "center", justifyCenter: "center"
            }}
          >
             <span className="font-serif italic text-[#C9A06E] text-xs font-bold tracking-widest">A S</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-16 w-full max-w-4xl px-4">
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
