import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/LanguageContext";

export function BotMockup() {
  const { t } = useLanguage();
  const [visibleMessages, setVisibleMessages] = useState<typeof t.botMockup.conversation>([]);

  useEffect(() => {
    setVisibleMessages([]);
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    t.botMockup.conversation.forEach((msg, i) => {
      const timeout = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, msg]);
      }, 1000 + i * 1200);
      timeouts.push(timeout);
    });
    return () => { timeouts.forEach(clearTimeout); };
  }, [t]);

  return (
    <section className="w-full bg-secondary/30 py-24 px-6 md:px-12 flex flex-col items-center justify-center">
      <div className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4 uppercase tracking-widest">
          {t.botMockup.heading}
        </h2>
        <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.botMockup.subheading}
        </p>
      </div>

      <div className="w-full max-w-[320px] aspect-[9/19] bg-background rounded-[3rem] border-[8px] border-foreground p-4 shadow-2xl relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-foreground rounded-b-xl z-20" />
        <div className="flex items-center gap-3 pb-4 border-b border-border mt-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-serif text-foreground">A</div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          </div>
          <div>
            <h4 className="font-sans font-medium text-sm text-foreground">Atelier Sève</h4>
            <p className="font-sans text-[10px] text-muted-foreground">{t.botMockup.online}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-4 flex flex-col gap-3 pb-2 scrollbar-hide">
          <AnimatePresence>
            {visibleMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[85%] rounded-2xl px-4 py-2 font-sans text-sm ${
                  msg.sender === "client"
                    ? "bg-muted text-foreground self-end rounded-tr-sm"
                    : "bg-secondary text-foreground self-start rounded-tl-sm border border-border/20"
                }`}
              >
                {msg.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="pt-3 border-t border-border flex items-center gap-2">
          <div className="flex-1 h-9 bg-muted rounded-full px-4 flex items-center">
            <span className="font-sans text-xs text-muted-foreground">{t.botMockup.placeholder}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
