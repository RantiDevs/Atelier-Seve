import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Viso",
    description: "Trattamenti personalizzati per una pelle luminosa e rigenerata.",
  },
  {
    title: "Ciglia",
    description: "Extension e laminazione per uno sguardo intenso e definito.",
  },
  {
    title: "Corpo",
    description: "Rituali corpo per nutrire, modellare e rinnovare.",
  },
  {
    title: "Epilazione",
    description: "Tecnica avanzata per una pelle setosa e duratura.",
  },
  {
    title: "Trattamento Labbra",
    description: "Volumizzazione e cura per labbra perfette.",
  },
];

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const rows = containerRef.current.querySelectorAll(".service-row");
    
    rows.forEach((row) => {
      gsap.fromTo(
        row,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "power3.inOut",
          duration: 1.2,
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="services" ref={containerRef} className="w-full bg-background py-24 px-6 md:px-12 lg:px-24 text-foreground">
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-16 md:mb-24 uppercase tracking-wide">
        I Nostri Trattamenti
      </h2>

      <div className="flex flex-col space-y-16 md:space-y-32">
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <div 
              key={service.title} 
              className={`service-row flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}
            >
              <div className="w-full md:w-1/2 aspect-[4/3] bg-gradient-to-br from-secondary to-muted relative overflow-hidden group">
                 {/* Placeholder for real images */}
                 <div className="absolute inset-0 bg-foreground/5 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col items-start justify-center">
                <h3 className="font-serif italic text-3xl md:text-4xl text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="font-sans text-lg md:text-xl text-muted-foreground mb-8 max-w-md">
                  {service.description}
                </p>
                <a 
                  href="#" 
                  className="group relative font-sans text-sm tracking-widest uppercase text-input transition-colors hover:text-foreground inline-flex items-center gap-2"
                  data-testid={`link-service-${index}`}
                >
                  Scopri
                  <span className="text-xl transition-transform group-hover:translate-x-2">→</span>
                  <span className="absolute -bottom-2 left-0 h-[1px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
