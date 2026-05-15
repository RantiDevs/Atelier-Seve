import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export function IntroStatement() {
  const { lang, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const lineTopRef = useRef<HTMLDivElement>(null);
  const lineBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const text1Spans = text1Ref.current?.querySelectorAll("span") ?? [];
      const text2Spans = text2Ref.current?.querySelectorAll("span") ?? [];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      if (lineTopRef.current) {
        tl.fromTo(lineTopRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.out" }, 0);
      }

      if (text1Spans.length) {
        tl.fromTo(
          text1Spans,
          { opacity: 0.12, y: 32 },
          { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "power3.out" },
          0.2,
        );
      }

      if (text2Spans.length) {
        tl.fromTo(
          text2Spans,
          { opacity: 0.12, y: 32 },
          { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "power3.out" },
          0.4,
        );
      }

      if (lineBottomRef.current) {
        tl.fromTo(lineBottomRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.out" }, 0.8);
      }
    });

    return () => ctx.revert();
  }, [lang]);

  return (
    <section
      ref={containerRef}
      className="w-full bg-background py-32 px-6 md:px-12 flex flex-col items-center justify-center text-center"
    >
      <div ref={lineTopRef} className="w-16 md:w-24 h-[1px] bg-input scale-x-0 origin-center mb-16" />
      <h2 ref={text1Ref} className="font-serif text-3xl md:text-5xl lg:text-6xl italic text-foreground leading-tight max-w-4xl">
        {t.intro.line1.split(" ").map((word, i) => (
          <span key={i} className="inline-block opacity-10 translate-y-8 mr-2 md:mr-3 pb-1">
            {word}
          </span>
        ))}
      </h2>
      <h2 ref={text2Ref} className="font-serif text-3xl md:text-5xl lg:text-6xl italic text-foreground leading-tight max-w-4xl mt-2 md:mt-4">
        {t.intro.line2.split(" ").map((word, i) => (
          <span key={i} className="inline-block opacity-10 translate-y-8 mr-2 md:mr-3 pb-1">
            {word}
          </span>
        ))}
      </h2>
      <div ref={lineBottomRef} className="w-16 md:w-24 h-[1px] bg-input scale-x-0 origin-center mt-16" />
    </section>
  );
}
