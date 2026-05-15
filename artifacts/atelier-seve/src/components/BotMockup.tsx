import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/LanguageContext";

type ConvMsg = { sender: "client" | "bot"; text: string };

export function BotMockup() {
  const { t } = useLanguage();
  const [visibleMessages, setVisibleMessages] = useState<ConvMsg[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCallMode, setIsCallMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleMessages([]);
    setCurrentIndex(0);
    setIsTyping(false);
  }, [t]);

  useEffect(() => {
    if (currentIndex >= t.botMockup.conversation.length) return;
    const msg = t.botMockup.conversation[currentIndex];

    if (msg.sender === "bot") {
      setIsTyping(true);
      const typingTimer = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((prev) => [...prev, msg]);
        const nextTimer = setTimeout(() => setCurrentIndex((i) => i + 1), 800);
        return () => clearTimeout(nextTimer);
      }, 1200);
      return () => clearTimeout(typingTimer);
    } else {
      const timer = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, msg]);
        const nextTimer = setTimeout(() => setCurrentIndex((i) => i + 1), 600);
        return () => clearTimeout(nextTimer);
      }, currentIndex === 0 ? 800 : 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, t]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [visibleMessages, isTyping]);

  const now = new Date();
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <section className="w-full py-28 px-5 md:px-10 flex flex-col items-center justify-center" style={{ backgroundColor: "#0e0905" }}>
      <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24">
        <div className="text-center lg:text-left max-w-md">
          <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#C9A06E] mb-3 block">
            AI Integrata
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl italic text-[#F9F4EE] mb-6 leading-tight">
            {t.botMockup.heading}
          </h2>
          <p className="font-sans text-base text-[rgba(249,244,238,0.55)] leading-relaxed mb-8">
            {t.botMockup.subheading}
          </p>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
            {[
              { icon: "⚡", label: t.botMockup.online },
              { icon: "🌙", label: "24 / 7" },
              { icon: "✦", label: "AI-powered" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: "rgba(201,160,110,0.12)", border: "1px solid rgba(201,160,110,0.25)" }}
                >
                  {item.icon}
                </div>
                <span className="font-sans text-sm" style={{ color: "rgba(249,244,238,0.65)" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 relative" style={{ perspective: "1200px" }}>
          <div
            className="relative"
            style={{
              width: "280px",
              height: "600px",
              transform: "rotateY(-6deg) rotateX(2deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="absolute inset-0 rounded-[46px] overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #2a2a2a 0%, #141414 40%, #1a1a1a 100%)",
                boxShadow: `
                  0 0 0 1px rgba(255,255,255,0.12),
                  0 0 0 3px rgba(255,255,255,0.04),
                  inset 0 0 0 1px rgba(255,255,255,0.08),
                  0 30px 80px rgba(0,0,0,0.8),
                  0 8px 20px rgba(0,0,0,0.5),
                  20px 0 40px rgba(0,0,0,0.3)
                `,
              }}
            >
              <div
                className="absolute inset-[3px] rounded-[44px] overflow-hidden"
                style={{ background: "#000" }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
                    pointerEvents: "none",
                    zIndex: 10,
                    borderRadius: "42px",
                  }}
                />

                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
                  style={{
                    width: "120px",
                    height: "34px",
                    backgroundColor: "#000",
                    borderRadius: "0 0 22px 22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
                  <div style={{ width: "36px", height: "8px", borderRadius: "4px", backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
                </div>

                <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-10 pb-1">
                  <span className="text-white text-[11px] font-semibold">{timeStr}</span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setIsCallMode(!isCallMode)} className="text-[#C9A06E] mr-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </button>
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="white">
                      <rect x="0" y="4" width="2" height="6" rx="1" />
                      <rect x="3.5" y="2.5" width="2" height="7.5" rx="1" />
                      <rect x="7" y="1" width="2" height="9" rx="1" />
                      <rect x="10.5" y="0" width="2" height="10" rx="1" />
                    </svg>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="white">
                      <path d="M7 2C9.2 2 11.2 2.9 12.6 4.4L14 3C12.2 1.1 9.7 0 7 0S1.8 1.1 0 3l1.4 1.4C2.8 2.9 4.8 2 7 2zm0 4c1.1 0 2.1.4 2.8 1.1L11.2 5.7C10.1 4.7 8.6 4 7 4S3.9 4.7 2.8 5.7l1.4 1.4C4.9 6.4 5.9 6 7 6zm0 4a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                    <svg width="20" height="10" viewBox="0 0 24 12" fill="none">
                      <rect x="0.5" y="0.5" width="19" height="11" rx="3.5" stroke="white" strokeOpacity="0.35" />
                      <rect x="2" y="2" width="14" height="8" rx="2" fill="white" />
                      <path d="M21 4v4a2 2 0 000-4z" fill="white" fillOpacity="0.4" />
                    </svg>
                  </div>
                </div>

                <div
                  className="absolute inset-0 flex flex-col"
                  style={{ paddingTop: "52px" }}
                >
                  {isCallMode ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                      <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="absolute inset-0 rounded-full border border-[#C9A06E]"
                            animate={{ scale: isSpeaking ? [1, 1.5, 1] : 1, opacity: isSpeaking ? [0.8, 0, 0.8] : 0.2 }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                          />
                        ))}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C9A06E] to-[#E8C4B8] flex items-center justify-center text-4xl font-serif text-[#1C1210] relative z-10">
                          A
                        </div>
                      </div>
                      <h3 className="text-[#F9F4EE] text-2xl font-serif italic mb-2">Atelier Sève AI</h3>
                      <p className="text-[#C9A06E] text-sm mb-12">{isSpeaking ? "Listening..." : "Connected"}</p>
                      
                      <div className="flex items-center gap-6 mt-auto">
                        <button
                          onClick={() => setIsSpeaking(!isSpeaking)}
                          className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="22" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setIsCallMode(false)}
                          className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500/80 hover:bg-red-500 transition-colors"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                            <line x1="23" y1="1" x2="1" y2="23" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="flex items-center gap-2.5 px-3 py-2.5 border-b"
                        style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(0,0,0,0.6)" }}
                      >
                        <button className="text-[#0A84FF] text-xs font-medium">←</button>
                        <div className="relative">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center font-serif font-bold text-sm"
                            style={{ background: "linear-gradient(135deg, #C9A06E, #E8C4B8)", color: "#1C1210" }}
                          >
                            A
                          </div>
                          <div
                            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-black animate-pulse"
                            style={{ backgroundColor: "#34C759" }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-xs font-semibold leading-tight">Atelier Sève</div>
                          <div className="text-[10px]" style={{ color: "#34C759" }}>{t.botMockup.online}</div>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => setIsCallMode(true)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.16 1.22 2 2 0 012.14.05h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                            </svg>
                          </button>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" />
                          </svg>
                        </div>
                      </div>

                      <div
                        ref={messagesRef}
                        className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2 scrollbar-hide"
                        style={{ overscrollBehavior: "contain" }}
                      >
                        <AnimatePresence>
                          {visibleMessages.map((msg, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 8, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className={`max-w-[82%] ${msg.sender === "client" ? "self-end" : "self-start"}`}
                            >
                              <div
                                className="px-3 py-2 rounded-2xl text-[11px] leading-snug"
                                style={
                                  msg.sender === "client"
                                    ? {
                                      background: "linear-gradient(135deg, #C9A06E, #9E7B7B)",
                                      color: "#fff",
                                      borderBottomRightRadius: "4px",
                                    }
                                    : {
                                      backgroundColor: "rgba(255,255,255,0.1)",
                                      color: "rgba(255,255,255,0.9)",
                                      borderBottomLeftRadius: "4px",
                                      backdropFilter: "blur(4px)",
                                    }
                                }
                              >
                                {msg.text}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="self-start"
                          >
                            <div
                              className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
                              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                            >
                              {[0, 1, 2].map((i) => (
                                <div
                                  key={i}
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{
                                    backgroundColor: "#C9A06E",
                                    animation: `bounce 1s infinite ${i * 150}ms`,
                                  }}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div
                        className="px-3 py-2.5 flex items-center gap-2 border-t"
                        style={{
                          borderColor: "rgba(255,255,255,0.08)",
                          backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                      >
                        <div
                          className="flex-1 h-8 rounded-full px-3.5 flex items-center"
                          style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                        >
                          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {t.botMockup.placeholder}
                          </span>
                        </div>
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, #C9A06E, #9E7B7B)" }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div
                    className="h-1 mx-auto mb-2 mt-1 rounded-full"
                    style={{ width: "120px", backgroundColor: "rgba(255,255,255,0.3)" }}
                  />
                </div>
              </div>
            </div>

            <div
              className="absolute inset-0 rounded-[46px] pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(255,255,255,0.02) 100%)",
              }}
            />

            <div
              className="absolute -right-3 top-1/3"
              style={{
                width: "4px",
                height: "60px",
                borderRadius: "0 2px 2px 0",
                background: "linear-gradient(180deg, #2a2a2a, #1a1a1a)",
                boxShadow: "2px 0 4px rgba(0,0,0,0.4)",
              }}
            />
            <div
              className="absolute -left-3 top-[28%]"
              style={{
                width: "4px",
                height: "36px",
                borderRadius: "2px 0 0 2px",
                background: "linear-gradient(180deg, #2a2a2a, #1a1a1a)",
                boxShadow: "-2px 0 4px rgba(0,0,0,0.4)",
              }}
            />
            <div
              className="absolute -left-3 top-[40%]"
              style={{
                width: "4px",
                height: "36px",
                borderRadius: "2px 0 0 2px",
                background: "linear-gradient(180deg, #2a2a2a, #1a1a1a)",
                boxShadow: "-2px 0 4px rgba(0,0,0,0.4)",
              }}
            />
          </div>

          <div
            className="absolute -inset-8 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 60%, rgba(201,160,110,0.12) 0%, transparent 65%)",
              filter: "blur(20px)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
