export function Marquee() {
  const text = "Trattamento Viso · Ciglia · Corpo · Epilazione · Labbra · Rigenerazione · Luminosità · Benessere · ";
  
  return (
    <section className="w-full bg-secondary py-4 overflow-hidden border-y border-border/20">
      <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite]">
        <span className="font-serif italic text-2xl md:text-3xl text-primary shrink-0 mr-2">
          {text}
        </span>
        <span className="font-serif italic text-2xl md:text-3xl text-primary shrink-0 mr-2">
          {text}
        </span>
        <span className="font-serif italic text-2xl md:text-3xl text-primary shrink-0 mr-2">
          {text}
        </span>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  );
}
