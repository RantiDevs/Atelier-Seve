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
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 60%",
      end: "bottom 20%",
      scrub: false,
      onUpdate: (self) => {
        setStep(Math.min(Math.floor(self.progress * 6), 4));
      },
    });
    return () => { trigger.kill(); };
  }, []);

  const faceRadius = 90;
  const cx = 130;
  const cy = 130;

  return (
    <section
      ref={containerRef}
      className="w-full py-32 px-6 md:px-12 flex flex-col items-center"
      style={{ backgroundColor: "#1C1210", minHeight: "90vh" }}
    >
      <h2
        className="font-serif text-4xl md:text-6xl italic text-center mb-6"
        style={{ color: "#F9F4EE" }}
      >
        {ms.heading}
      </h2>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 mt-12 w-full max-w-5xl">
        <div className="relative" style={{ width: "260px", height: "320px", flexShrink: 0 }}>
          <svg viewBox="0 0 260 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <radialGradient id="skinBase" cx="50%" cy="45%" r="50%">
                <stop offset="0%" stopColor="#d4a88a" />
                <stop offset="100%" stopColor="#c49070" />
              </radialGradient>
              <radialGradient id="foundGrad" cx="50%" cy="45%" r="50%">
                <stop offset="0%" stopColor="#e0b898" />
                <stop offset="100%" stopColor="#c9a07a" />
              </radialGradient>
            </defs>

            <ellipse cx={cx} cy={cy + 10} rx={faceRadius} ry={faceRadius + 18} fill="url(#skinBase)" opacity="0.25" />

            {step >= 1 && (
              <ellipse
                cx={cx} cy={cy + 10}
                rx={faceRadius} ry={faceRadius + 18}
                fill="url(#foundGrad)"
                opacity="0.5"
                style={{ transition: "opacity 0.8s ease" }}
              />
            )}

            {step >= 2 && (
              <>
                <ellipse cx={cx - 52} cy={cy + 30} rx="28" ry="16" fill="#E8C4B8" opacity="0.65" style={{ filter: "blur(6px)", transition: "opacity 0.8s ease" }} />
                <ellipse cx={cx + 52} cy={cy + 30} rx="28" ry="16" fill="#E8C4B8" opacity="0.65" style={{ filter: "blur(6px)", transition: "opacity 0.8s ease" }} />
              </>
            )}

            {step >= 3 && (
              <>
                <path
                  d={`M${cx - 34},${cy - 22} Q${cx - 22},${cy - 30} ${cx - 8},${cy - 22}`}
                  stroke="#2a1a14" strokeWidth="2.5" strokeLinecap="round" fill="none"
                  style={{ strokeDasharray: 40, strokeDashoffset: step >= 3 ? 0 : 40, transition: "stroke-dashoffset 0.8s ease" }}
                />
                <path
                  d={`M${cx + 8},${cy - 22} Q${cx + 22},${cy - 30} ${cx + 34},${cy - 22}`}
                  stroke="#2a1a14" strokeWidth="2.5" strokeLinecap="round" fill="none"
                  style={{ strokeDasharray: 40, strokeDashoffset: step >= 3 ? 0 : 40, transition: "stroke-dashoffset 0.8s ease 0.2s" }}
                />
                <line x1={cx - 34} y1={cy - 22} x2={cx - 52} y2={cy - 28} stroke="#2a1a14" strokeWidth="1.5" strokeLinecap="round" />
                <line x1={cx + 34} y1={cy - 22} x2={cx + 52} y2={cy - 28} stroke="#2a1a14" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}

            {step >= 4 && (
              <>
                <path
                  d={`M${cx - 28},${cy + 62} Q${cx},${cy + 74} ${cx + 28},${cy + 62}`}
                  stroke="#9E4055" strokeWidth="5" strokeLinecap="round" fill="none"
                  style={{ filter: "drop-shadow(0 0 4px rgba(158,64,85,0.7))", strokeDasharray: 60, strokeDashoffset: step >= 4 ? 0 : 60, transition: "stroke-dashoffset 0.8s ease" }}
                />
                <path
                  d={`M${cx - 28},${cy + 62} Q${cx - 14},${cy + 56} ${cx},${cy + 58} Q${cx + 14},${cy + 56} ${cx + 28},${cy + 62}`}
                  stroke="#9E4055" strokeWidth="4" strokeLinecap="round" fill="none"
                  style={{ strokeDasharray: 60, strokeDashoffset: step >= 4 ? 0 : 60, transition: "stroke-dashoffset 0.8s ease 0.1s" }}
                />
              </>
            )}

            <ellipse cx={cx - 20} cy={cy - 12} rx="5" ry="3.5" fill="#2a1a14" opacity={step >= 1 ? 0.85 : 0.4} style={{ transition: "opacity 0.5s" }} />
            <ellipse cx={cx + 20} cy={cy - 12} rx="5" ry="3.5" fill="#2a1a14" opacity={step >= 1 ? 0.85 : 0.4} style={{ transition: "opacity 0.5s" }} />

            <ellipse cx={cx} cy={cx + 35} rx={faceRadius} ry={faceRadius + 18} fill="none" stroke="rgba(201,160,110,0.3)" strokeWidth="1" />
          </svg>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          {ms.steps.map((label, i) => (
            <div
              key={i}
              className="flex items-center gap-5 px-5 py-4 rounded-xl transition-all duration-500"
              style={{
                backgroundColor: step >= i ? "rgba(201,160,110,0.12)" : "transparent",
                border: `1px solid ${step >= i ? "rgba(201,160,110,0.35)" : "rgba(201,160,110,0.1)"}`,
                transform: step >= i ? "translateX(0)" : "translateX(-8px)",
                opacity: step >= i ? 1 : 0.35,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans shrink-0 transition-all duration-500"
                style={{
                  backgroundColor: step >= i ? "#C9A06E" : "transparent",
                  border: `1px solid ${step >= i ? "#C9A06E" : "rgba(201,160,110,0.3)"}`,
                  color: step >= i ? "#1C1210" : "#C9A06E",
                }}
              >
                {i + 1}
              </div>
              <span
                className="font-serif italic text-xl"
                style={{ color: step >= i ? "#F9F4EE" : "#9E7B7B" }}
              >
                {label}
              </span>
              {step === i && (
                <span className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#C9A06E" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
