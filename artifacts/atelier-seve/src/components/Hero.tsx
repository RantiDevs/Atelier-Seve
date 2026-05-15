import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/LanguageContext";
import { ParticleField } from "@/components/ParticleField";
import { FluidBlobScene } from "@/components/FluidBlob";
import { WebGLErrorBoundary } from "@/components/WebGLErrorBoundary";
import { useMagneticButton } from "@/hooks/useMagneticButton";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const { lang, t } = useLanguage();
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const petal1 = useRef<HTMLDivElement>(null);
  const petal2 = useRef<HTMLDivElement>(null);
  const petal3 = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const magnetic = useMagneticButton(0.4);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.05 });

      if (logoRef.current) {
        tl.fromTo(logoRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0);
      }
      if (lineRef.current) {
        tl.to(lineRef.current, { scaleX: 1, duration: 0.5, ease: "power2.out" }, 0.25);
      }
      if (ctaRef.current) {
        tl.fromTo(ctaRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.6);
      }

      tl.to(
        title1Ref.current?.querySelectorAll("span > span") || [],
        { y: "0%", duration: 0.7, stagger: 0.08, ease: "power3.out" },
        0.2,
      );
      tl.to(
        title2Ref.current?.querySelectorAll("span > span") || [],
        { y: "0%", duration: 0.7, stagger: 0.08, ease: "power3.out" },
        0.35,
      );

      const parallaxEls = [
        { el: petal1.current, speed: 0.15 },
        { el: petal2.current, speed: 0.08 },
        { el: petal3.current, speed: 0.22 },
      ];

      parallaxEls.forEach(({ el, speed }) => {
        if (!el) return;
        gsap.to(el, {
          y: () => window.innerHeight * speed * -1,
          ease: "none",
          scrollTrigger: { trigger: "body", start: "top top", end: "bottom top", scrub: true },
        });
      });
    });

    return () => ctx.revert();
  }, [lang]);

  return (
    <section className="relative flex flex-col md:flex-row min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-50 opacity-[0.035] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div
        className="flex w-full md:w-1/2 flex-col items-start justify-center p-8 md:p-16 lg:p-24 relative z-10 min-h-[55vh] md:min-h-screen overflow-hidden"
        style={{ backgroundColor: "#1C1210" }}
      >
        <div ref={petal1} className="absolute top-1/4 right-8 pointer-events-none select-none opacity-[0.08]">
          <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
            <ellipse cx="30" cy="40" rx="18" ry="38" fill="#C9A06E" transform="rotate(-20 30 40)" />
          </svg>
        </div>
        <div ref={petal2} className="absolute bottom-1/3 left-4 pointer-events-none select-none opacity-[0.06]">
          <svg width="40" height="56" viewBox="0 0 40 56" fill="none">
            <ellipse cx="20" cy="28" rx="12" ry="26" fill="#9E7B7B" transform="rotate(15 20 28)" />
          </svg>
        </div>

        <div ref={logoRef} className="mb-14 opacity-0">
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="#C9A06E" strokeWidth="1.5" />
              <path d="M20 11V29M11 20H29" stroke="#C9A06E" strokeWidth="1.5" />
            </svg>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: "rgba(201,160,110,0.55)" }}>
              Milano
            </span>
          </div>
        </div>

        <div className="w-full">
          <h1
            ref={title1Ref}
            className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl italic leading-tight"
            style={{ color: "#F9F4EE" }}
          >
            {t.hero.line1.split(" ").map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 mr-3 sm:mr-4">
                <span className="inline-block translate-y-[120%]">{word}</span>
              </span>
            ))}
          </h1>
          <h1
            ref={title2Ref}
            className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl italic leading-tight"
            style={{ color: "#F9F4EE" }}
          >
            {t.hero.line2.split(" ").map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 mr-3 sm:mr-4">
                <span className="inline-block translate-y-[120%]">{word}</span>
              </span>
            ))}
          </h1>
        </div>

        <div
          ref={lineRef}
          className="my-10 h-px w-full max-w-[180px] origin-left scale-x-0"
          style={{ backgroundColor: "#C9A06E" }}
        />

        <button
          ref={(el) => {
            (magnetic.ref as React.MutableRefObject<HTMLButtonElement | null>).current = el;
            (ctaRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
          }}
          onMouseMove={magnetic.onMouseMove as React.MouseEventHandler}
          onMouseLeave={magnetic.onMouseLeave}
          onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
          className="group relative font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 px-7 py-3.5 rounded-full opacity-0"
          style={{
            color: "#C9A06E",
            border: "1px solid rgba(201,160,110,0.35)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ background: "radial-gradient(ellipse at center, rgba(201,160,110,0.18) 0%, transparent 70%)" }}
          />
          {t.hero.cta}
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>

        <div className="absolute bottom-8 left-8 md:left-16 lg:left-24 flex items-center gap-2 opacity-30">
          <div className="w-px h-12" style={{ backgroundColor: "#C9A06E" }} />
          <span className="font-sans text-[9px] uppercase tracking-[0.3em]" style={{ color: "#C9A06E" }}>
            {lang === "it" ? "Scorri" : "Scroll"}
          </span>
        </div>
      </div>

      <div
        className="relative w-full h-[40vh] md:h-auto md:w-1/2 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#F9F4EE" }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 85% 85% at 50% 50%, rgba(232,196,184,0.55) 0%, rgba(249,244,238,0) 70%)" }}
        />

        <div ref={petal3} className="absolute top-12 right-12 pointer-events-none select-none opacity-15">
          <svg width="80" height="110" viewBox="0 0 80 110" fill="none">
            <ellipse cx="40" cy="55" rx="22" ry="52" fill="#E8C4B8" transform="rotate(30 40 55)" />
          </svg>
        </div>

        <ParticleField count={40} />

        <div
          ref={blobRef}
          className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-96 md:h-96 z-10"
          style={{ transformOrigin: "center center" }}
        >
          <WebGLErrorBoundary
            fallback={
              <div
                className="w-full h-full"
                style={{
                  borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                  background:
                    "radial-gradient(ellipse at 40% 40%, rgba(232,196,184,0.95) 0%, rgba(201,160,110,0.75) 45%, rgba(158,123,123,0.45) 100%)",
                  boxShadow: "0 0 60px rgba(201,160,110,0.35)",
                  animation: "blobMorph 7s ease-in-out infinite",
                }}
              />
            }
          >
            <FluidBlobScene />
          </WebGLErrorBoundary>
        </div>

        <div className="absolute bottom-12 right-12 w-2 h-2 rounded-full" style={{ backgroundColor: "#C9A06E", opacity: 0.4 }} />
        <div className="absolute top-16 left-16 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#9E7B7B", opacity: 0.35 }} />
        <div className="absolute top-1/3 right-6 w-1 h-1 rounded-full" style={{ backgroundColor: "#C9A06E", opacity: 0.3 }} />
      </div>
    </section>
  );
}
