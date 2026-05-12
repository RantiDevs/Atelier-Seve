import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/LanguageContext";
import { ParticleField } from "@/components/ParticleField";
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
  const magnetic = useMagneticButton(0.4);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    if (logoRef.current) {
      tl.fromTo(logoRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0);
    }
    if (blobRef.current) {
      tl.fromTo(blobRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: "power3.out" }, 0);
    }
    if (lineRef.current) {
      tl.to(lineRef.current, { scaleX: 1, duration: 0.6, ease: "power2.out" }, 0.2);
    }

    const animateWords = (ref: React.RefObject<HTMLHeadingElement | null>, startTime: number) => {
      if (!ref.current) return;
      const text = ref.current.innerText;
      const words = text.split(" ");
      ref.current.innerHTML = "";
      words.forEach((word) => {
        const span = document.createElement("span");
        span.className = "inline-block overflow-hidden pb-2 mr-4";
        const inner = document.createElement("span");
        inner.className = "inline-block translate-y-[120%]";
        inner.innerText = word;
        span.appendChild(inner);
        ref.current?.appendChild(span);
      });
      tl.to(ref.current.querySelectorAll("span > span"), { y: "0%", duration: 0.8, stagger: 0.1, ease: "power3.out" }, startTime);
    };

    animateWords(title1Ref, 0.4);
    animateWords(title2Ref, 0.6);

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

    return () => { ScrollTrigger.getAll().forEach((s) => s.kill()); };
  }, [lang]);

  return (
    <section className="relative flex flex-col md:flex-row min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-50 opacity-[0.04] mix-blend-overlay">
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
        <div ref={petal1} className="absolute top-1/4 right-8 pointer-events-none select-none opacity-10">
          <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
            <ellipse cx="30" cy="40" rx="18" ry="38" fill="#C9A06E" transform="rotate(-20 30 40)" />
          </svg>
        </div>
        <div ref={petal2} className="absolute bottom-1/3 left-4 pointer-events-none select-none opacity-8">
          <svg width="40" height="56" viewBox="0 0 40 56" fill="none">
            <ellipse cx="20" cy="28" rx="12" ry="26" fill="#9E7B7B" transform="rotate(15 20 28)" />
          </svg>
        </div>

        <div ref={logoRef} className="mb-16 opacity-0">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="19" stroke="#C9A06E" strokeWidth="2" />
            <path d="M20 10V30M10 20H30" stroke="#C9A06E" strokeWidth="2" />
          </svg>
        </div>

        <div className="w-full">
          <h1 ref={title1Ref} className="font-serif text-5xl md:text-7xl lg:text-8xl italic leading-tight" style={{ color: "#F9F4EE" }}>
            {t.hero.line1}
          </h1>
          <h1 ref={title2Ref} className="font-serif text-5xl md:text-7xl lg:text-8xl italic leading-tight" style={{ color: "#F9F4EE" }}>
            {t.hero.line2}
          </h1>
        </div>

        <div ref={lineRef} className="my-12 h-[1px] w-full max-w-[200px] origin-left scale-x-0" style={{ backgroundColor: "#C9A06E" }} />

        <button
          ref={magnetic.ref as React.RefObject<HTMLButtonElement>}
          onMouseMove={magnetic.onMouseMove as React.MouseEventHandler}
          onMouseLeave={magnetic.onMouseLeave}
          onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
          className="group relative font-sans text-sm tracking-widest uppercase transition-colors px-6 py-3 rounded-full"
          style={{
            color: "#C9A06E",
            border: "1px solid rgba(201,160,110,0.3)",
          }}
        >
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "radial-gradient(ellipse at center, rgba(201,160,110,0.15) 0%, transparent 70%)" }}
          />
          {t.hero.cta}
        </button>
      </div>

      <div
        className="relative w-full h-[45vh] md:h-auto md:w-1/2 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#F9F4EE" }}
      >
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(232,196,184,0.5) 0%, transparent 70%)" }} />

        <div ref={petal3} className="absolute top-12 right-12 pointer-events-none select-none opacity-20">
          <svg width="80" height="110" viewBox="0 0 80 110" fill="none">
            <ellipse cx="40" cy="55" rx="22" ry="52" fill="#E8C4B8" transform="rotate(30 40 55)" />
          </svg>
        </div>

        <ParticleField count={40} />

        <div ref={blobRef} className="relative w-72 h-72 md:w-96 md:h-96 z-10" style={{ transformOrigin: "center center" }}>
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: "drop-shadow(0 20px 60px rgba(201,160,110,0.35))" }}>
            <defs>
              <radialGradient id="blobGradient" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#D4B483" />
                <stop offset="50%" stopColor="#C9A06E" />
                <stop offset="100%" stopColor="#9E7B7B" />
              </radialGradient>
            </defs>
            <path fill="url(#blobGradient)">
              <animate attributeName="d" dur="8s" repeatCount="indefinite" values="
                M211.5,60.3C241.9,73.4,267.1,97.3,283.2,124.8C299.3,152.3,306.4,183.3,298.1,211.5C289.8,239.7,266.1,265.1,238.3,279.8C210.5,294.5,178.6,298.5,150.2,287.3C121.8,276.1,96.9,249.7,81.5,220.3C66.1,190.9,60.2,158.5,70.8,131.3C81.4,104.1,108.6,82.1,137.9,68.7C167.2,55.3,198.7,55.5,211.5,60.3Z;
                M220.3,58.5C252.1,68.4,278.5,91.2,292.8,119.8C307.1,148.4,309.3,182.8,297.6,212.3C285.9,241.8,260.3,266.4,230.8,278.5C201.3,290.6,167.8,290.2,140.2,276.4C112.6,262.6,90.9,235.4,77.8,206.3C64.7,177.2,60.2,146.2,69.8,118.7C79.4,91.2,103.1,67.2,131.8,55.8C160.5,44.4,194.5,50.9,220.3,58.5Z;
                M209.5,57.2C239.8,65.4,265.7,87.7,284.4,114.3C303.1,140.9,314.6,171.8,309.3,200.5C304,229.2,282,255.7,254.5,272.3C227,288.9,194,295.6,164.5,286.4C135,277.2,109,252.1,91.5,223.4C74,194.7,65,162.4,70.9,134.1C76.8,105.8,97.6,81.5,123.7,67.1C149.8,52.7,181.1,50.4,209.5,57.2Z;
                M211.5,60.3C241.9,73.4,267.1,97.3,283.2,124.8C299.3,152.3,306.4,183.3,298.1,211.5C289.8,239.7,266.1,265.1,238.3,279.8C210.5,294.5,178.6,298.5,150.2,287.3C121.8,276.1,96.9,249.7,81.5,220.3C66.1,190.9,60.2,158.5,70.8,131.3C81.4,104.1,108.6,82.1,137.9,68.7C167.2,55.3,198.7,55.5,211.5,60.3Z" />
            </path>
            <ellipse cx="155" cy="140" rx="45" ry="30" fill="rgba(255,255,255,0.18)" style={{ mixBlendMode: "overlay" }} transform="rotate(-20, 155, 140)" />
          </svg>
        </div>
        <div className="absolute bottom-12 right-12 w-2 h-2 rounded-full" style={{ backgroundColor: "#C9A06E", opacity: 0.5 }} />
        <div className="absolute top-16 left-16 w-1 h-1 rounded-full" style={{ backgroundColor: "#9E7B7B", opacity: 0.4 }} />
      </div>
    </section>
  );
}
