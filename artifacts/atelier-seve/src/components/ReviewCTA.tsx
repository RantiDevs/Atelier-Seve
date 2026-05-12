import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export function ReviewCTA() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !starsRef.current) return;
    gsap.fromTo(
      starsRef.current.children,
      { opacity: 0, scale: 0.5, rotation: -45 },
      {
        opacity: 1, scale: 1, rotation: 0, stagger: 0.2, duration: 0.6, ease: "back.out(1.7)",
        scrollTrigger: { trigger: containerRef.current, start: "top 75%" },
      }
    );
    return () => { ScrollTrigger.getAll().forEach((s) => s.kill()); };
  }, [t]);

  return (
    <section ref={containerRef} className="w-full bg-foreground py-32 px-6 md:px-12 flex flex-col items-center justify-center text-center">
      <h2 className="font-serif text-3xl md:text-5xl italic text-background mb-6">{t.reviewCta.heading}</h2>
      <p className="font-sans text-lg text-muted-foreground max-w-2xl mb-12">{t.reviewCta.subheading}</p>
      <div ref={starsRef} className="flex gap-4 mb-16 text-[#C9A06E] text-4xl md:text-5xl">
        {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
      </div>
      <a
        href="https://www.google.com/search?q=Atelier+Sève+recensioni"
        target="_blank"
        rel="noopener noreferrer"
        className="px-8 py-4 bg-secondary text-foreground font-sans text-sm uppercase tracking-widest hover:bg-input transition-colors rounded-sm"
      >
        {t.reviewCta.cta}
      </a>
    </section>
  );
}
