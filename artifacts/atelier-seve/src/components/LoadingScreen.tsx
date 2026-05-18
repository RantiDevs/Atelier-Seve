import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const strokeRef = useRef<SVGPathElement>(null);
  const brushRef = useRef<SVGGElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const sublineRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!strokeRef.current || !brushRef.current || !containerRef.current) return;

    const path = strokeRef.current;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
              setMounted(false);
              onDone();
            },
          });
        },
      });

    tl.to(path, {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: "power3.inOut",
      onUpdate() {
        if (!brushRef.current) return;
        const point = path.getPointAtLength(length * this.progress());
        
        // Calculate the dynamic angle/tangent of the curve
        const delta = 2;
        const prevLen = Math.max(0, length * this.progress() - delta);
        const nextLen = Math.min(length, length * this.progress() + delta);
        const pPrev = path.getPointAtLength(prevLen);
        const pNext = path.getPointAtLength(nextLen);
        
        const dx = pNext.x - pPrev.x;
        const dy = pNext.y - pPrev.y;
        const pathAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        // Organic sweep motion: base trailing tilt + dynamic curve leaning + subtle hand stroke sweep
        const sweepAngle = -28 + pathAngle * 0.3 + Math.sin(this.progress() * Math.PI * 5) * 5;
        
        brushRef.current.setAttribute("transform", `translate(${point.x}, ${point.y}) rotate(${sweepAngle})`);
      },
    }, 0);
      const headlineSpans = headlineRef.current?.querySelectorAll("span");
      if (headlineSpans?.length) {
        tl.to(
          headlineSpans,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.04,
            ease: "power3.out",
          },
          1.0,
        );
      }

      const sublineSpans = sublineRef.current?.querySelectorAll("span");
      if (sublineSpans?.length) {
        tl.to(
          sublineSpans,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.02,
            ease: "power3.out",
          },
          1.35,
        );
      }
    });

    return () => ctx.revert();
  }, [onDone]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#1C1210]"
    >
      <div className="relative w-[80vw] max-w-[560px]">
        <svg
          viewBox="0 0 600 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full overflow-visible"
        >
          <defs>
            <linearGradient id="brushStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E8C4B8" />
              <stop offset="100%" stopColor="#C9A06E" />
            </linearGradient>
          </defs>
          <path
            ref={strokeRef}
            d="M10,80 C60,10 120,110 180,60 C240,10 280,90 340,55 C400,20 440,95 500,50 C540,20 570,70 590,45"
            stroke="url(#brushStroke)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            style={{ filter: "drop-shadow(0 0 14px rgba(201,160,110,0.55))" }}
          />
          <g ref={brushRef} transform="translate(0, 0)">
            <image 
              href="/brush.png" 
              x="-22.5" 
              y="-5" 
              width="45" 
              height="175"
            />
          </g>
        </svg>
        <div className="mt-8 text-center">
          <div ref={headlineRef} className="font-serif italic text-4xl md:text-5xl text-[#F9F4EE] leading-tight tracking-[0.05em]">
            {"Atelier Sève".split("").map((char, i) => (
              <span 
                key={i} 
                className="inline-block opacity-0 translate-y-4"
                style={{ width: char === " " ? "0.5rem" : "auto" }}
              >
                {char}
              </span>
            ))}
          </div>
          <div ref={sublineRef} className="font-sans uppercase text-xs tracking-[0.4em] text-[#C9A06E] mt-4">
            {"Milano".split("").map((char, i) => (
              <span 
                key={i} 
                className="inline-block opacity-0 translate-y-4"
                style={{ width: char === " " ? "0.5rem" : "auto" }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
