import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/LanguageContext";

const navLinks = [
  { labelIt: "Trattamenti", labelEn: "Treatments", href: "#services" },
  { labelIt: "Prodotti", labelEn: "Products", href: "#products" },
  { labelIt: "Il Rituale", labelEn: "The Ritual", href: "#ritual" },
  { labelIt: "Trasformazioni", labelEn: "Transformations", href: "#transformations" },
  { labelIt: "Prenota", labelEn: "Book", href: "#intake" },
];

export function Navbar() {
  const { lang, toggleLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = ["services", "products", "ritual", "transformations", "intake"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(28,18,16,0.95)" : "rgba(28,18,16,0.15)",
          backdropFilter: scrolled ? "blur(24px) saturate(1.8)" : "blur(4px)",
          borderBottom: scrolled ? "1px solid rgba(201,160,110,0.15)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 md:h-18 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hidden sm:flex items-center gap-3 group"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                border: "1.5px solid rgba(201,160,110,0.6)",
                background: "rgba(201,160,110,0.08)",
              }}
            >
              <span className="font-serif italic text-xs font-bold" style={{ color: "#C9A06E" }}>AS</span>
            </div>
            <span
              className="font-serif italic text-lg tracking-wide transition-colors duration-300 group-hover:text-[#C9A06E]"
              style={{ color: "#F9F4EE" }}
            >
              Atelier Sève
            </span>
          </button>

          {/* Minimalist Mobile Spacer to keep language and menu on the right */}
          <div className="flex-1 md:hidden" />

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="relative font-sans text-[11px] uppercase tracking-[0.15em] transition-colors duration-200 py-1"
                  style={{ color: isActive ? "#C9A06E" : "rgba(249,244,238,0.65)" }}
                >
                  {lang === "it" ? link.labelIt : link.labelEn}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-0.5 left-0 right-0 h-px"
                      style={{ backgroundColor: "#C9A06E" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 font-sans text-[10px] tracking-widest uppercase px-2.5 py-1.5 rounded-full border transition-all duration-300 hover:bg-[rgba(201,160,110,0.12)]"
              style={{ borderColor: "rgba(201,160,110,0.35)", color: "#C9A06E" }}
            >
              <span style={{ opacity: lang === "it" ? 1 : 0.35 }}>IT</span>
              <span style={{ color: "rgba(201,160,110,0.25)", margin: "0 1px" }}>|</span>
              <span style={{ opacity: lang === "en" ? 1 : 0.35 }}>EN</span>
            </button>

            <button
              onClick={() => scrollTo("#intake")}
              className="hidden md:flex items-center px-5 py-2 font-sans text-[10px] uppercase tracking-[0.18em] transition-all duration-300 rounded-full hover:opacity-90 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #C9A06E 0%, #9E7B7B 100%)",
                color: "#F9F4EE",
                boxShadow: "0 4px 15px rgba(201,160,110,0.3)",
              }}
            >
              {lang === "it" ? "Prenota" : "Book Now"}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 flex flex-col gap-[4px] items-center justify-center w-10 h-10 group"
              aria-label="Menu"
            >
              {menuOpen ? (
                <div className="relative w-6 h-6">
                   <span className="absolute top-1/2 left-0 w-full h-px bg-[#C9A06E] rotate-45" />
                   <span className="absolute top-1/2 left-0 w-full h-px bg-[#C9A06E] -rotate-45" />
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A06E] transition-all duration-300 group-hover:scale-125" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A06E] transition-all duration-300 group-hover:scale-125" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A06E] transition-all duration-300 group-hover:scale-125" />
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 top-16 z-[99] md:hidden origin-top"
            style={{
              backgroundColor: "rgba(20,12,10,0.98)",
              backdropFilter: "blur(24px)",
              borderBottom: "1px solid rgba(201,160,110,0.15)",
            }}
          >
            <div className="flex flex-col px-6 pt-4 pb-6 gap-1">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(link.href)}
                  className="w-full text-left py-4 font-serif italic text-xl border-b transition-colors duration-200 hover:text-[#C9A06E]"
                  style={{
                    color: "rgba(249,244,238,0.85)",
                    borderColor: "rgba(201,160,110,0.1)",
                  }}
                >
                  {lang === "it" ? link.labelIt : link.labelEn}
                </motion.button>
              ))}
              <button
                onClick={() => scrollTo("#intake")}
                className="mt-4 w-full py-3.5 font-sans text-xs uppercase tracking-widest rounded-full transition-all duration-300 hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #C9A06E, #9E7B7B)",
                  color: "#F9F4EE",
                }}
              >
                {lang === "it" ? "Prenota ora" : "Book now"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
