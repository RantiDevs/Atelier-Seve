import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Alessia T.",
    quote: "Un'esperienza di pura bellezza. Chiara è semplicemente magica, mi ha trasformata.",
  },
  {
    name: "Federica R.",
    quote: "Il trattamento viso ha cambiato completamente la mia pelle. Tornerò sempre.",
  },
  {
    name: "Martina G.",
    quote: "Ambiente raffinato, mani esperte, risultati incredibili. Atelier Sève è unico.",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-background py-24 px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center border-t border-border/20">
      <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-16 uppercase tracking-widest">
        Le Nostre Clienti
      </h2>
      
      <div className="relative w-full max-w-4xl h-[300px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <p className="font-serif italic text-2xl md:text-4xl lg:text-5xl text-foreground leading-snug mb-8">
              "{testimonials[index].quote}"
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="flex space-x-1 text-input">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-serif text-foreground">
                  {testimonials[index].name.charAt(0)}
                </div>
                <span className="font-sans font-medium text-foreground tracking-widest uppercase text-sm">
                  {testimonials[index].name}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
