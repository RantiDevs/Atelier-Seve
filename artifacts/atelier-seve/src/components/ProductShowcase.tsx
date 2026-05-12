import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

function RotatingLipstick({ rotationDeg }: { rotationDeg: number }) {
  const lipstickAngle = (rotationDeg % 360) * (Math.PI / 180);
  const skewX = Math.sin(lipstickAngle) * 8;
  const scaleX = 0.85 + Math.abs(Math.cos(lipstickAngle)) * 0.15;
  const highlightX = 28 + Math.sin(lipstickAngle) * 18;

  return (
    <svg viewBox="0 0 120 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_30px_60px_rgba(201,160,110,0.5)]">
      <defs>
        <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b8956a" />
          <stop offset="40%" stopColor="#e8c88a" />
          <stop offset="100%" stopColor="#9a7850" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a1a14" />
          <stop offset="45%" stopColor="#4a2e22" />
          <stop offset="100%" stopColor="#1a0e0a" />
        </linearGradient>
        <linearGradient id="bulletGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8a3540" />
          <stop offset="30%" stopColor="#c9606e" />
          <stop offset="60%" stopColor="#e8909a" />
          <stop offset="100%" stopColor="#7a2530" />
        </linearGradient>
        <radialGradient id="highlight" cx={`${highlightX}%`} cy="20%" r="35%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g transform={`translate(60,160) skewX(${skewX}) scale(${scaleX},1) translate(-60,-160)`}>
        <rect x="22" y="10" width="76" height="90" rx="6" fill="url(#capGrad)" />
        <rect x="22" y="10" width="76" height="90" rx="6" fill="url(#highlight)" opacity="0.6" />
        <rect x="26" y="14" width="68" height="82" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <text x="60" y="60" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="9" fill="rgba(28,18,16,0.6)" letterSpacing="1">Sève</text>

        <rect x="28" y="100" width="64" height="16" rx="2" fill="#3a2818" />
        <rect x="22" y="116" width="76" height="170" rx="4" fill="url(#bodyGrad)" />
        <rect x="22" y="116" width="76" height="170" rx="4" fill="url(#highlight)" opacity="0.2" />
        <rect x="30" y="200" width="60" height="1" fill="rgba(201,160,110,0.4)" />
        <rect x="30" y="220" width="60" height="1" fill="rgba(201,160,110,0.2)" />
        <text x="60" y="185" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="11" fill="rgba(201,160,110,0.7)" letterSpacing="2">ATELIER</text>
        <text x="60" y="200" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="11" fill="rgba(201,160,110,0.7)" letterSpacing="2">SÈVE</text>

        <ellipse cx="60" cy="116" rx="38" ry="6" fill="#2a1a14" />
        <path d="M22,110 Q60,95 98,110 L98,116 Q60,101 22,116 Z" fill="url(#bulletGrad)" />
        <path d="M22,116 Q60,101 98,116 Q60,108 22,116 Z" fill="rgba(255,255,255,0.15)" />
        <ellipse cx="60" cy="110" rx="38" ry="6" fill="url(#bulletGrad)" filter="url(#glow)" />
        <path d="M28,110 Q60,90 92,110" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function SwatchCard({ swatch, delay }: { swatch: { name: string; hex: string }; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className="relative flex flex-col items-center gap-3 cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-500"
        style={{
          width: hovered ? "90px" : "64px",
          height: hovered ? "130px" : "64px",
          backgroundColor: swatch.hex,
          boxShadow: hovered ? `0 20px 40px ${swatch.hex}88` : `0 4px 12px ${swatch.hex}44`,
        }}
      >
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.5) 0%, transparent 60%)`,
            opacity: hovered ? 1 : 0.5,
          }}
        />
        {hovered && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-white/60 bg-white/20" />
          </div>
        )}
      </div>
      <span
        className="font-sans text-xs uppercase tracking-widest text-center transition-all duration-300"
        style={{
          color: "#9E7B7B",
          maxWidth: "80px",
          opacity: hovered ? 1 : 0.7,
        }}
      >
        {swatch.name}
      </span>
    </div>
  );
}

export function ProductShowcase() {
  const { t } = useLanguage();
  const ps = t.productShowcase;
  const containerRef = useRef<HTMLDivElement>(null);
  const lipstickRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => { setRotation(self.progress * 360); },
    });

    gsap.fromTo(lipstickRef.current, { opacity: 0, y: 60 }, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: containerRef.current, start: "top 75%" },
    });

    return () => { trigger.kill(); ScrollTrigger.getAll().forEach((s) => s.kill()); };
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full py-32 px-6 md:px-12 lg:px-24 overflow-hidden relative"
      style={{ backgroundColor: "#F9F4EE" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(232,196,184,0.35) 0%, transparent 70%)" }}
      />

      <div className="text-center mb-20 relative z-10">
        <h2 className="font-serif text-4xl md:text-6xl italic mb-4" style={{ color: "#1C1210" }}>
          {ps.heading}
        </h2>
        <p className="font-sans text-lg" style={{ color: "#9E7B7B" }}>{ps.subheading}</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 relative z-10">
        <div ref={lipstickRef} className="flex flex-col items-center gap-6 opacity-0">
          <div
            className="relative"
            style={{
              width: "140px",
              height: "380px",
              filter: `drop-shadow(0 40px 80px rgba(201,160,110,0.4))`,
            }}
          >
            <RotatingLipstick rotationDeg={rotation} />
          </div>
          <span className="font-sans text-xs uppercase tracking-widest" style={{ color: "#9E7B7B" }}>
            {ps.rotateHint}
          </span>
        </div>

        <div className="flex flex-col gap-16">
          <div
            className="relative p-8 rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(201,160,110,0.12) 0%, rgba(232,196,184,0.08) 100%)",
              border: "1px solid rgba(201,160,110,0.25)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 40%, transparent 80%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 3s ease-in-out infinite",
              }}
            />
            <style>{`
              @keyframes shimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
            `}</style>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full mb-4" style={{ background: "linear-gradient(135deg, #C9A06E, #E8C4B8)", boxShadow: "0 0 20px rgba(201,160,110,0.4)" }} />
              <h3 className="font-serif italic text-2xl mb-2" style={{ color: "#1C1210" }}>{ps.liquidLabel}</h3>
              <div className="flex gap-2 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-1 rounded-full flex-1" style={{ backgroundColor: `rgba(201,160,110,${0.3 + i * 0.25})` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
            {ps.swatches.map((sw, i) => (
              <SwatchCard key={sw.name} swatch={sw} delay={i * 80} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
