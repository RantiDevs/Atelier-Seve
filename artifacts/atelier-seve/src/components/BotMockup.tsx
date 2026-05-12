import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: number;
  sender: "client" | "bot";
  text: string;
  delay: number;
};

const conversation: Message[] = [
  { id: 1, sender: "client", text: "Ciao! Quali trattamenti fate per il viso?", delay: 1000 },
  { id: 2, sender: "bot", text: "Ciao! Offriamo trattamenti personalizzati: pulizia profonda, idratazione, anti-age e rigenerazione. Quale ti interessa di più? 😊", delay: 2200 },
  { id: 3, sender: "client", text: "Quanto costa la pulizia del viso?", delay: 3400 },
  { id: 4, sender: "bot", text: "La pulizia profonda è a €65, include anche il massaggio rilassante. Vuoi prenotare? 🌸", delay: 4600 },
  { id: 5, sender: "client", text: "Sì! Quando siete disponibili?", delay: 5800 },
  { id: 6, sender: "bot", text: "Abbiamo disponibilità martedì alle 15:00 o giovedì alle 11:00. Quale preferisci?", delay: 7000 },
];

export function BotMockup() {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    // Reset and start animation
    setVisibleMessages([]);
    
    conversation.forEach((msg) => {
      const timeout = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, msg]);
      }, msg.delay);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="w-full bg-secondary/30 py-24 px-6 md:px-12 flex flex-col items-center justify-center">
      <div className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4 uppercase tracking-widest">
          Rispondiamo Sempre, Anche di Notte
        </h2>
        <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
          Il nostro assistente AI risponde automaticamente ai messaggi Instagram.
        </p>
      </div>

      <div className="w-full max-w-[320px] aspect-[9/19] bg-background rounded-[3rem] border-[8px] border-foreground p-4 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-foreground rounded-b-xl z-20" />
        
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border mt-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-serif text-foreground">
              A
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          </div>
          <div>
            <h4 className="font-sans font-medium text-sm text-foreground">Atelier Sève</h4>
            <p className="font-sans text-[10px] text-muted-foreground">Risponde all'istante</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto pt-4 flex flex-col gap-3 pb-2 scrollbar-hide">
          <AnimatePresence>
            {visibleMessages.map((msg) => (
              <motion.div
                key={msg.id}
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

        {/* Input Area */}
        <div className="pt-3 border-t border-border flex items-center gap-2">
          <div className="flex-1 h-9 bg-muted rounded-full px-4 flex items-center">
            <span className="font-sans text-xs text-muted-foreground">Scrivi un messaggio...</span>
          </div>
        </div>
      </div>
    </section>
  );
}
