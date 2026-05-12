import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const strokeRef = useRef<SVGPathElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!strokeRef.current || !containerRef.current) return;

    const path = strokeRef.current;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

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
      duration: 1.4,
      ease: "power3.inOut",
    }, 0);

    if (logoRef.current) {
      tl.fromTo(logoRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        0.8
      );
    }

    tl.to({}, { duration: 0.5 });
  }, [onDone]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
      style={{ backgroundColor: "#1C1210" }}
    >
      <svg
        viewBox="0 0 600 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[80vw] max-w-[560px]"
        style={{ overflow: "visible" }}
      >
        <path
          ref={strokeRef}
          d="M10,80 C60,10 120,110 180,60 C240,10 280,90 340,55 C400,20 440,95 500,50 C540,20 570,70 590,45"
          stroke="#C9A06E"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          style={{ filter: "drop-shadow(0 0 8px rgba(201,160,110,0.7))" }}
        />
      </svg>
      <div ref={logoRef} className="mt-8 opacity-0 flex flex-col items-center gap-2">
        <span className="font-serif italic text-3xl" style={{ color: "#F9F4EE", letterSpacing: "0.04em" }}>
          Atelier Sève
        </span>
        <span className="font-sans text-xs uppercase tracking-[0.3em]" style={{ color: "#C9A06E" }}>
          Milano
        </span>
      </div>
    </div>
  );
}
