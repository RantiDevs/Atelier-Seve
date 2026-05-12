import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function Hero() {
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    // Logo fade in
    if (logoRef.current) {
      tl.fromTo(logoRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0);
    }

    // Blob scale in
    if (blobRef.current) {
      tl.fromTo(blobRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: "power3.out" }, 0);
    }

    // Line expansion
    if (lineRef.current) {
      tl.to(lineRef.current, { scaleX: 1, duration: 0.6, ease: "power2.out" }, 0.2);
    }

    // Word reveal
    const animateWords = (
      ref: React.RefObject<HTMLHeadingElement | null>,
      startTime: number
    ) => {
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
      tl.to(
        ref.current.querySelectorAll("span > span"),
        { y: "0%", duration: 0.8, stagger: 0.1, ease: "power3.out" },
        startTime
      );
    };

    animateWords(title1Ref, 0.4);
    animateWords(title2Ref, 0.6);
  }, []);

  return (
    <section className="relative flex flex-col md:flex-row min-h-screen w-full overflow-hidden">
      {/* Grain overlay */}
      <div className="pointer-events-none absolute inset-0 z-50 opacity-[0.04] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Left — espresso */}
      <div
        className="flex w-full md:w-1/2 flex-col items-start justify-center p-8 md:p-16 lg:p-24 relative z-10 min-h-[55vh] md:min-h-screen"
        style={{ backgroundColor: "#1C1210" }}
      >
        <div ref={logoRef} className="mb-16 opacity-0" data-testid="hero-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="19" stroke="#C9A06E" strokeWidth="2" />
            <path d="M20 10V30M10 20H30" stroke="#C9A06E" strokeWidth="2" />
          </svg>
        </div>

        <div className="w-full">
          <h1
            ref={title1Ref}
            className="font-serif text-5xl md:text-7xl lg:text-8xl italic leading-tight"
            style={{ color: "#F9F4EE" }}
          >
            La Bellezza
          </h1>
          <h1
            ref={title2Ref}
            className="font-serif text-5xl md:text-7xl lg:text-8xl italic leading-tight"
            style={{ color: "#F9F4EE" }}
          >
            è un Rituale.
          </h1>
        </div>

        <div
          ref={lineRef}
          className="my-12 h-[1px] w-full max-w-[200px] origin-left scale-x-0"
          style={{ backgroundColor: "#C9A06E" }}
        />

        <button
          onClick={() =>
            document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
          }
          className="group relative font-sans text-sm tracking-widest uppercase transition-colors"
          style={{ color: "#C9A06E" }}
          data-testid="hero-cta"
        >
          Scopri i Trattamenti
          <span
            className="absolute -bottom-2 left-0 h-[1px] w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
            style={{ backgroundColor: "#C9A06E" }}
          />
        </button>
      </div>

      {/* Right — cream + morphing blob */}
      <div
        className="relative w-full h-[45vh] md:h-auto md:w-1/2 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#F9F4EE" }}
      >
        {/* Subtle radial gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(232,196,184,0.5) 0%, transparent 70%)",
          }}
        />

        {/* Morphing blob */}
        <div
          ref={blobRef}
          className="relative w-72 h-72 md:w-96 md:h-96"
          style={{ transformOrigin: "center center" }}
        >
          <svg
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 20px 60px rgba(201,160,110,0.35))" }}
          >
            <defs>
              <radialGradient id="blobGradient" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#D4B483" />
                <stop offset="50%" stopColor="#C9A06E" />
                <stop offset="100%" stopColor="#9E7B7B" />
              </radialGradient>
              <filter id="blobBlur">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path
              fill="url(#blobGradient)"
              style={{
                animation: "morphBlob 8s ease-in-out infinite",
              }}
            >
              <animate
                attributeName="d"
                dur="8s"
                repeatCount="indefinite"
                values="
                  M211.5,60.3C241.9,73.4,267.1,97.3,283.2,124.8C299.3,152.3,306.4,183.3,298.1,211.5C289.8,239.7,266.1,265.1,238.3,279.8C210.5,294.5,178.6,298.5,150.2,287.3C121.8,276.1,96.9,249.7,81.5,220.3C66.1,190.9,60.2,158.5,70.8,131.3C81.4,104.1,108.6,82.1,137.9,68.7C167.2,55.3,198.7,55.5,211.5,60.3Z;
                  M220.3,58.5C252.1,68.4,278.5,91.2,292.8,119.8C307.1,148.4,309.3,182.8,297.6,212.3C285.9,241.8,260.3,266.4,230.8,278.5C201.3,290.6,167.8,290.2,140.2,276.4C112.6,262.6,90.9,235.4,77.8,206.3C64.7,177.2,60.2,146.2,69.8,118.7C79.4,91.2,103.1,67.2,131.8,55.8C160.5,44.4,194.5,50.9,220.3,58.5Z;
                  M209.5,57.2C239.8,65.4,265.7,87.7,284.4,114.3C303.1,140.9,314.6,171.8,309.3,200.5C304,229.2,282,255.7,254.5,272.3C227,288.9,194,295.6,164.5,286.4C135,277.2,109,252.1,91.5,223.4C74,194.7,65,162.4,70.9,134.1C76.8,105.8,97.6,81.5,123.7,67.1C149.8,52.7,181.1,50.4,209.5,57.2Z;
                  M211.5,60.3C241.9,73.4,267.1,97.3,283.2,124.8C299.3,152.3,306.4,183.3,298.1,211.5C289.8,239.7,266.1,265.1,238.3,279.8C210.5,294.5,178.6,298.5,150.2,287.3C121.8,276.1,96.9,249.7,81.5,220.3C66.1,190.9,60.2,158.5,70.8,131.3C81.4,104.1,108.6,82.1,137.9,68.7C167.2,55.3,198.7,55.5,211.5,60.3Z
                "
              />
            </path>
            {/* Specular highlight */}
            <ellipse
              cx="155"
              cy="140"
              rx="45"
              ry="30"
              fill="rgba(255,255,255,0.18)"
              style={{ mixBlendMode: "overlay" }}
              transform="rotate(-20, 155, 140)"
            />
          </svg>
        </div>

        {/* Subtle decorative dots */}
        <div
          className="absolute bottom-12 right-12 w-2 h-2 rounded-full"
          style={{ backgroundColor: "#C9A06E", opacity: 0.5 }}
        />
        <div
          className="absolute top-16 left-16 w-1 h-1 rounded-full"
          style={{ backgroundColor: "#9E7B7B", opacity: 0.4 }}
        />
      </div>
    </section>
  );
}
