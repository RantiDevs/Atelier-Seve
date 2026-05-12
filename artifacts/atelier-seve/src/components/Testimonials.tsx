import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/LanguageContext";

export function Testimonials() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % t.testimonials.items.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [t]);

  const item = t.testimonials.items[index];

  return (
    <section className="w-full bg-background py-24 px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center border-t border-border/20">
      <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-16 uppercase tracking-widest">
        {t.testimonials.heading}
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
              "{item.quote}"
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="flex space-x-1 text-input">{[...Array(5)].map((_, i) => <span key={i}>★</span>)}</div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-serif text-foreground">
                  {item.name.charAt(0)}
                </div>
                <span className="font-sans font-medium text-foreground tracking-widest uppercase text-sm">{item.name}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
