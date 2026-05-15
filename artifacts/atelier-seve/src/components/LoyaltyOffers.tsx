import React, { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export function LoyaltyOffers() {
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start", 
    containScroll: "trimSnaps",
    loop: true 
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!emblaApi) return;
    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 2000); // 2 seconds for a premium, readable feel

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    
    return () => {
      clearInterval(intervalId);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll(".offer-card");
      gsap.fromTo(cards, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 85%" },
      });
    });
    return () => ctx.revert();
  }, [t]);

  return (
    <section ref={containerRef} className="w-full bg-[#1C1210] py-24 px-0 md:px-12 lg:px-24 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 to-transparent pointer-events-none" />
      <div className="px-6 md:px-0 flex justify-between items-end mb-12 md:mb-16 relative z-10">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F9F4EE] uppercase tracking-widest leading-tight">
          {t.loyalty.heading}
        </h2>
      </div>
      <div className="embla relative z-10 px-6 md:px-0" ref={emblaRef}>
        <div className="embla__container flex gap-5 md:gap-8">
          {t.loyalty.items.map((offer, index) => (
            <div key={index} className="offer-card embla__slide flex-[0_0_82%] sm:flex-[0_0_60%] md:flex-[0_0_40%] lg:flex-[0_0_30%] min-w-0 relative">
              <div className="h-full flex flex-col justify-between p-7 md:p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(201,160,110,0.2)] transition-all duration-500 group">
                <div>
                  <h3 className="font-serif italic text-2xl text-[#F9F4EE] mb-4 group-hover:text-secondary transition-colors">{offer.title}</h3>
                  <p className="font-sans text-sm text-[#F9F4EE]/60 mb-8 leading-relaxed">{offer.description}</p>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl text-[#C9A06E]">{offer.price}</span>
                  {offer.originalPrice && (
                    <span className="font-sans text-sm text-[#F9F4EE]/30 line-through">{offer.originalPrice}</span>
                  )}
                </div>
                <button className="mt-8 w-full py-3.5 border border-[#C9A06E]/30 text-[#F9F4EE] font-sans text-[10px] uppercase tracking-[0.2em] hover:bg-[#C9A06E] hover:text-[#1C1210] transition-all duration-300">
                  {t.loyalty.learnMore}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2.5 mt-10 md:hidden relative z-10">
        {t.loyalty.items.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{ 
              backgroundColor: selectedIndex === i ? "#C9A06E" : "rgba(201,160,110,0.2)",
              transform: selectedIndex === i ? "scale(1.2)" : "scale(1)"
            }}
          />
        ))}
      </div>
    </section>
  );
}
