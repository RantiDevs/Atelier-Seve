import { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const offers = [
  {
    title: "Prima Visita",
    description: "Trattamento viso completo per accoglierti nel nostro atelier.",
    price: "€65",
    originalPrice: "€90",
  },
  {
    title: "Pacchetto Ciglia",
    description: "3 sessioni extension per uno sguardo sempre perfetto.",
    price: "€150",
    originalPrice: "€210",
  },
  {
    title: "Tessera Sève",
    description: "Accesso illimitato igiene viso per 3 mesi.",
    price: "€180",
    originalPrice: "",
  },
];

export function LoyaltyOffers() {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const cards = containerRef.current.querySelectorAll(".offer-card");
    
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-foreground py-24 px-6 md:px-12 lg:px-24 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 to-transparent pointer-events-none" />
      
      <div className="flex justify-between items-end mb-16 relative z-10">
        <h2 className="font-serif text-3xl md:text-5xl text-background uppercase tracking-widest">
          Esclusive per Te
        </h2>
      </div>

      <div className="embla relative z-10" ref={emblaRef}>
        <div className="embla__container flex gap-6 md:gap-8">
          {offers.map((offer, index) => (
            <div 
              key={index}
              className="offer-card embla__slide flex-[0_0_85%] min-w-0 sm:flex-[0_0_60%] md:flex-[0_0_40%] lg:flex-[0_0_30%] relative"
            >
              <div className="h-full flex flex-col justify-between p-8 bg-background/5 backdrop-blur-md border border-border/20 rounded-xl hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(201,160,110,0.15)] transition-all duration-300 group">
                <div>
                  <h3 className="font-serif italic text-2xl text-background mb-4 group-hover:text-secondary transition-colors">
                    {offer.title}
                  </h3>
                  <p className="font-sans text-muted-foreground mb-8">
                    {offer.description}
                  </p>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl text-border">{offer.price}</span>
                  {offer.originalPrice && (
                    <span className="font-sans text-sm text-muted-foreground line-through">
                      {offer.originalPrice}
                    </span>
                  )}
                </div>
                <button className="mt-8 w-full py-3 border border-border/30 text-background font-sans text-xs uppercase tracking-widest hover:bg-secondary hover:text-foreground transition-colors" data-testid={`offer-btn-${index}`}>
                  Scopri di più
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
