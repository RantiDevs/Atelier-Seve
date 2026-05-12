import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function IntroStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const lineTopRef = useRef<HTMLDivElement>(null);
  const lineBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const wrapWords = (element: HTMLElement | null) => {
      if (!element) return;
      const words = element.innerText.split(" ");
      element.innerHTML = "";
      words.forEach((word) => {
        const span = document.createElement("span");
        span.className = "inline-block opacity-0 translate-y-4 mr-2 md:mr-3 pb-1";
        span.innerText = word;
        element.appendChild(span);
      });
    };

    wrapWords(text1Ref.current);
    wrapWords(text2Ref.current);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    if (lineTopRef.current) {
      tl.to(lineTopRef.current, { scaleX: 1, duration: 0.8, ease: "power2.out" }, 0);
    }

    if (text1Ref.current) {
      tl.to(
        text1Ref.current.querySelectorAll("span"),
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" },
        0.2
      );
    }

    if (text2Ref.current) {
      tl.to(
        text2Ref.current.querySelectorAll("span"),
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" },
        0.6
      );
    }

    if (lineBottomRef.current) {
      tl.to(lineBottomRef.current, { scaleX: 1, duration: 0.8, ease: "power2.out" }, 1);
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="w-full bg-background py-32 px-6 md:px-12 flex flex-col items-center justify-center text-center"
      data-testid="intro-statement"
    >
      <div 
        ref={lineTopRef} 
        className="w-16 md:w-24 h-[1px] bg-input scale-x-0 origin-center mb-16"
      />
      
      <h2 
        ref={text1Ref}
        className="font-serif text-3xl md:text-5xl lg:text-6xl italic text-foreground leading-tight max-w-4xl"
      >
        Ogni trattamento è una cerimonia.
      </h2>
      <h2 
        ref={text2Ref}
        className="font-serif text-3xl md:text-5xl lg:text-6xl italic text-foreground leading-tight max-w-4xl mt-2 md:mt-4"
      >
        Ogni cliente, un'opera d'arte.
      </h2>
      
      <div 
        ref={lineBottomRef} 
        className="w-16 md:w-24 h-[1px] bg-input scale-x-0 origin-center mt-16"
      />
    </section>
  );
}
