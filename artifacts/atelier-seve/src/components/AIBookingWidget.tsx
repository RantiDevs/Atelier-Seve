import { useState, useRef, useEffect, useCallback } from "react";
import { useSendChat, ChatMessage, ChatMessageRole } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/LanguageContext";
import { translations } from "@/i18n";
import type { Lang } from "@/i18n";

type Mode = "chat" | "call";

export function AIBookingWidget() {
  const { lang: siteLang } = useLanguage();
  const [widgetLang, setWidgetLang] = useState<Lang>(siteLang);
  const t = translations[widgetLang].widget;

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: ChatMessageRole.assistant, content: t.welcome },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const sendChat = useSendChat();
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => { setWidgetLang(siteLang); }, [siteLang]);
  useEffect(() => {
    setMessages([{ role: ChatMessageRole.assistant, content: translations[widgetLang].widget.welcome }]);
  }, [widgetLang]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendChat.isPending]);

  // Lock body scroll when widget is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Preload voices (Chrome loads them async)
  const [voicesReady, setVoicesReady] = useState(false);
  useEffect(() => {
    const load = () => { if (window.speechSynthesis.getVoices().length) setVoicesReady(true); };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  // -- Pick the most realistic female voice available --
  const pickFemaleVoice = useCallback((lang: string): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = lang.split("-")[0];
    
    // Ranked list: most realistic/natural female voices first
    const ranked = [
      // Windows 11 Neural voices (very realistic)
      "Microsoft Elsa Online", "Microsoft Zira Online", "Microsoft Isabella Online",
      // macOS/iOS high-quality voices
      "Samantha", "Karen", "Moira", "Tessa", "Fiona", "Victoria",
      "Alice", "Federica", "Luca",
      // Google Chrome voices
      "Google UK English Female", "Google US English",
      "Google italiano",
      // Standard Windows voices
      "Microsoft Elsa", "Microsoft Zira", "Microsoft Isabella",
      // Edge voices
      "Microsoft Jenny", "Microsoft Aria",
    ];
    
    // Try ranked voices matching language
    for (const name of ranked) {
      const v = voices.find(v => v.name.includes(name) && v.lang.startsWith(langPrefix));
      if (v) return v;
    }
    // Try ranked voices regardless of language
    for (const name of ranked) {
      const v = voices.find(v => v.name.includes(name));
      if (v) return v;
    }
    // Any voice matching language
    return voices.find(v => v.lang.startsWith(langPrefix)) || voices[0] || null;
  }, [voicesReady]);

  // -- Speak text via SpeechSynthesis --
  const speak = useCallback((text: string, onDone?: () => void) => {
    if (!("speechSynthesis" in window)) { onDone?.(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = t.speechLang;
    const voice = pickFemaleVoice(t.speechLang);
    if (voice) u.voice = voice;
    u.rate = 0.88;   // Slower, relaxing pace
    u.pitch = 1.15;  // Slightly higher, warm feminine tone
    u.volume = 0.95;
    setIsSpeaking(true);
    u.onend = () => { setIsSpeaking(false); onDone?.(); };
    u.onerror = () => { setIsSpeaking(false); onDone?.(); };
    window.speechSynthesis.speak(u);
  }, [t.speechLang, pickFemaleVoice]);

  // -- Send message to API and handle response --
  const sendMessage = useCallback((text: string, isVoiceCall: boolean) => {
    const userMsg: ChatMessage = { role: ChatMessageRole.user, content: text };
    const newMsgs = [...messagesRef.current, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLiveTranscript("");

    sendChat.mutate({ data: { messages: newMsgs } }, {
      onSuccess: (response) => {
        const updated = [...newMsgs, { role: ChatMessageRole.assistant, content: response.message }];
        setMessages(updated);
        if (isVoiceCall) {
          speak(response.message, () => { startListening(); });
        } else {
          speak(response.message);
        }
      },
    });
  }, [sendChat, speak]);

  // -- Speech Recognition --
  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = t.speechLang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: any) => {
      let interim = "";
      let final = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setLiveTranscript(final || interim);
      if (final) {
        setIsListening(false);
        sendMessage(final, true);
      }
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    rec.start();
    recognitionRef.current = rec;
  }, [t.speechLang, sendMessage]);

  // -- Text chat send --
  const handleSend = () => {
    if (!input.trim() || sendChat.isPending) return;
    sendMessage(input.trim(), false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // -- Voice input for text mode --
  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert(t.voiceNotSupported);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = t.speechLang;
    rec.interimResults = false;
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: any) => setInput(e.results[0][0].transcript);
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    rec.start();
    recognitionRef.current = rec;
  };

  // -- Start / End call --
  const startCall = () => {
    setMode("call");
    setCallActive(true);
    setLiveTranscript("");
    // Greet then listen
    const welcome = messagesRef.current.length <= 1 ? t.welcome : "";
    if (welcome) {
      speak(welcome, () => startListening());
    } else {
      startListening();
    }
  };

  const endCall = () => {
    window.speechSynthesis.cancel();
    recognitionRef.current?.stop();
    setCallActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    setLiveTranscript("");
    setMode("chat");
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-[0_0_20px_rgba(201,160,110,0.4)] flex items-center justify-center z-40 transition-transform hover:scale-105"
        style={{ background: "linear-gradient(135deg, #C9A06E, #9E7B7B)" }}
        data-testid="widget-open-btn"
      >
        <div className="absolute inset-0 rounded-full border border-[#C9A06E] animate-ping opacity-30" />
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#F9F4EE]">
          <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(28,18,16,0.7)", backdropFilter: "blur(16px)" }}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0" onClick={() => { endCall(); setIsOpen(false); }} />
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 16 }}
              className="relative w-full max-w-[600px] h-[80vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
              style={{ backgroundColor: "#1C1210", border: "1px solid rgba(201,160,110,0.2)" }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b z-10"
                style={{ borderColor: "rgba(201,160,110,0.15)", backgroundColor: "rgba(28,18,16,0.8)", backdropFilter: "blur(8px)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-[#1C1210]" style={{ background: "linear-gradient(135deg, #C9A06E, #E8C4B8)" }}>C</div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1C1210]" />
                  </div>
                  <div>
                    <h3 className="font-serif italic text-lg" style={{ color: "#F9F4EE" }}>{t.title}</h3>
                    <span className="text-[10px] font-sans" style={{ color: mode === "call" && callActive ? "#34C759" : "rgba(201,160,110,0.6)" }}>
                      {mode === "call" && callActive ? (isSpeaking ? "Speaking..." : isListening ? "Listening..." : "Connected") : "Online"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Call toggle */}
                  {mode === "chat" ? (
                    <button onClick={startCall} className="p-2 rounded-lg transition-colors" style={{ color: "#C9A06E" }} title="Start voice call">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </button>
                  ) : (
                    <button onClick={() => { endCall(); setMode("chat"); }} className="p-2 rounded-lg" style={{ color: "#C9A06E" }} title="Switch to text">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  )}
                  {/* Lang toggle */}
                  <button
                    onClick={() => setWidgetLang((l) => l === "it" ? "en" : "it")}
                    className="flex items-center gap-1 font-sans text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border transition-all"
                    style={{ borderColor: "rgba(201,160,110,0.4)", color: "#C9A06E", backgroundColor: "rgba(201,160,110,0.08)" }}
                  >
                    <span style={{ opacity: widgetLang === "it" ? 1 : 0.4 }}>IT</span>
                    <span style={{ color: "rgba(201,160,110,0.3)" }}>|</span>
                    <span style={{ opacity: widgetLang === "en" ? 1 : 0.4 }}>EN</span>
                  </button>
                  {/* Close */}
                  <button onClick={() => { endCall(); setIsOpen(false); }} className="p-2" style={{ color: "#9E7B7B" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* BODY */}
              {mode === "call" ? (
                /* ====== VOICE CALL MODE ====== */
                <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                  {/* Pulsing rings */}
                  <div className="relative w-40 h-40 mb-10 flex items-center justify-center">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full"
                        style={{ border: "1px solid rgba(201,160,110,0.4)" }}
                        animate={{
                          scale: (isSpeaking || isListening) ? [1, 1.4 + i * 0.15, 1] : 1,
                          opacity: (isSpeaking || isListening) ? [0.6, 0, 0.6] : 0.15,
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
                      />
                    ))}
                    <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl font-serif text-[#1C1210] relative z-10"
                      style={{ background: "linear-gradient(135deg, #C9A06E, #E8C4B8)" }}>
                      C
                    </div>
                  </div>

                  <h3 className="text-[#F9F4EE] text-2xl font-serif italic mb-2">Chiara</h3>
                  <p className="text-sm mb-2" style={{ color: "#C9A06E" }}>
                    {isSpeaking ? "Speaking..." : isListening ? "Listening..." : sendChat.isPending ? "Thinking..." : "Connected"}
                  </p>

                  {/* Live transcript */}
                  {liveTranscript && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 px-6 py-3 rounded-xl max-w-sm text-center text-sm"
                      style={{ backgroundColor: "rgba(201,160,110,0.12)", color: "rgba(249,244,238,0.8)", border: "1px solid rgba(201,160,110,0.2)" }}
                    >
                      "{liveTranscript}"
                    </motion.div>
                  )}

                  {/* End call button */}
                  <button
                    onClick={endCall}
                    className="mt-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: "rgba(239,68,68,0.8)" }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                      <line x1="23" y1="1" x2="1" y2="23" />
                    </svg>
                  </button>
                </div>
              ) : (
                /* ====== TEXT CHAT MODE ====== */
                <>
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-hide">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex flex-col max-w-[85%] ${msg.role === ChatMessageRole.user ? "self-end items-end" : "self-start items-start"}`}>
                        <div
                          className={`px-5 py-3 rounded-2xl font-sans text-[15px] leading-relaxed shadow-sm ${msg.role === ChatMessageRole.user ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                          style={
                            msg.role === ChatMessageRole.user
                              ? { backgroundColor: "rgba(201,160,110,0.18)", color: "#F9F4EE" }
                              : { backgroundColor: "rgba(249,244,238,0.06)", color: "#F9F4EE", border: "1px solid rgba(201,160,110,0.12)" }
                          }
                        >
                          {msg.content}
                        </div>
                        {msg.content.toLowerCase().includes(t.bookingConfirmedKeyword) && msg.role === ChatMessageRole.assistant && (
                          <div className="mt-3 px-4 py-3 rounded-lg font-sans text-sm flex items-center gap-2"
                            style={{ border: "1px solid rgba(201,160,110,0.35)", backgroundColor: "rgba(201,160,110,0.1)", color: "#C9A06E" }}>
                            <span>✓</span> {t.bookingConfirmedLabel}
                          </div>
                        )}
                      </div>
                    ))}
                    {sendChat.isPending && (
                      <div className="self-start px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
                        style={{ backgroundColor: "rgba(249,244,238,0.06)", border: "1px solid rgba(201,160,110,0.12)" }}>
                        {[0, 200, 400].map((d) => (
                          <div key={d} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#C9A06E", animation: `bounce 1s infinite ${d}ms` }} />
                        ))}
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input bar */}
                  <div className="p-4 border-t" style={{ borderColor: "rgba(201,160,110,0.15)", backgroundColor: "rgba(28,18,16,0.9)" }}>
                    <div className="relative flex items-end gap-2 rounded-xl p-2"
                      style={{ backgroundColor: "rgba(249,244,238,0.05)", border: "1px solid rgba(201,160,110,0.18)" }}>
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t.placeholder}
                        className="flex-1 max-h-32 min-h-[44px] bg-transparent font-sans text-[15px] resize-none outline-none py-2 px-3 scrollbar-hide"
                        style={{ color: "#F9F4EE" }}
                        rows={1}
                      />
                      <div className="flex gap-2 p-1">
                        <button onClick={toggleListen} className="p-2 rounded-lg transition-colors"
                          style={{ color: isListening ? "#C9A06E" : "#9E7B7B", backgroundColor: isListening ? "rgba(201,160,110,0.15)" : "transparent", animation: isListening ? "pulse 1.5s infinite" : "none" }}
                          title={t.voiceTitle}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
                          </svg>
                        </button>
                        <button onClick={handleSend} disabled={!input.trim() || sendChat.isPending}
                          className="p-2 rounded-lg transition-opacity disabled:opacity-40"
                          style={{ background: "linear-gradient(135deg, #C9A06E, #9E7B7B)", color: "#F9F4EE" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
