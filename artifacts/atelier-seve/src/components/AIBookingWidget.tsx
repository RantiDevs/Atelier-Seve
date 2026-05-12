import { useState, useRef, useEffect } from "react";
import { useSendChat, ChatMessage, ChatMessageRole } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/LanguageContext";
import { translations } from "@/i18n";
import type { Lang } from "@/i18n";

export function AIBookingWidget() {
  const { lang: siteLang, t: siteT } = useLanguage();
  const [widgetLang, setWidgetLang] = useState<Lang>(siteLang);
  const t = translations[widgetLang].widget;

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: ChatMessageRole.assistant, content: t.welcome },
  ]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendChat = useSendChat();

  useEffect(() => {
    setWidgetLang(siteLang);
  }, [siteLang]);

  useEffect(() => {
    setMessages([{ role: ChatMessageRole.assistant, content: translations[widgetLang].widget.welcome }]);
  }, [widgetLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendChat.isPending]);

  const handleSend = () => {
    if (!input.trim() || sendChat.isPending) return;
    const userMessage: ChatMessage = { role: ChatMessageRole.user, content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    sendChat.mutate({ data: { messages: newMessages } }, {
      onSuccess: (response) => {
        setMessages([...newMessages, { role: ChatMessageRole.assistant, content: response.message }]);
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(response.message);
          utterance.lang = t.speechLang;
          utterance.rate = 0.92;
          utterance.pitch = 1.1;
          window.speechSynthesis.speak(utterance);
        }
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const toggleListen = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert(t.voiceNotSupported);
      return;
    }
    if (isListening) { setIsListening(false); return; }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = t.speechLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-[0_0_20px_rgba(201,160,110,0.4)] flex items-center justify-center z-40 transition-transform hover:scale-105"
        style={{ background: "linear-gradient(135deg, #C9A06E, #9E7B7B)" }}
        data-testid="widget-open-btn"
      >
        <div className="absolute inset-0 rounded-full border border-[#C9A06E] animate-ping opacity-30" />
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#F9F4EE]">
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
          >
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 16 }}
              className="relative w-full max-w-[600px] h-[80vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
              style={{ backgroundColor: "#1C1210", border: "1px solid rgba(201,160,110,0.2)" }}
            >
              <div
                className="flex items-center justify-between px-6 py-4 border-b z-10"
                style={{ borderColor: "rgba(201,160,110,0.15)", backgroundColor: "rgba(28,18,16,0.8)", backdropFilter: "blur(8px)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-[#1C1210]" style={{ background: "linear-gradient(135deg, #C9A06E, #E8C4B8)" }}>C</div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1C1210]" />
                  </div>
                  <h3 className="font-serif italic text-xl" style={{ color: "#F9F4EE" }}>{t.title}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setWidgetLang((l) => l === "it" ? "en" : "it")}
                    className="flex items-center gap-1 font-sans text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border transition-all duration-300"
                    style={{
                      borderColor: "rgba(201,160,110,0.4)",
                      color: "#C9A06E",
                      backgroundColor: "rgba(201,160,110,0.08)",
                    }}
                  >
                    <span style={{ opacity: widgetLang === "it" ? 1 : 0.4 }}>IT</span>
                    <span style={{ color: "rgba(201,160,110,0.3)", margin: "0 1px" }}>|</span>
                    <span style={{ opacity: widgetLang === "en" ? 1 : 0.4 }}>EN</span>
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 transition-colors" style={{ color: "#9E7B7B" }} data-testid="widget-close-btn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-hide">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col max-w-[85%] ${msg.role === ChatMessageRole.user ? "self-end items-end" : "self-start items-start"}`}>
                    <div
                      className={`px-5 py-3 rounded-2xl font-sans text-[15px] leading-relaxed shadow-sm ${
                        msg.role === ChatMessageRole.user
                          ? "rounded-tr-sm"
                          : "rounded-tl-sm"
                      }`}
                      style={
                        msg.role === ChatMessageRole.user
                          ? { backgroundColor: "rgba(201,160,110,0.18)", color: "#F9F4EE" }
                          : { backgroundColor: "rgba(249,244,238,0.06)", color: "#F9F4EE", border: "1px solid rgba(201,160,110,0.12)" }
                      }
                    >
                      {msg.content}
                    </div>
                    {msg.content.toLowerCase().includes(t.bookingConfirmedKeyword) && msg.role === ChatMessageRole.assistant && (
                      <div
                        className="mt-3 px-4 py-3 rounded-lg font-sans text-sm flex items-center gap-2"
                        style={{ border: "1px solid rgba(201,160,110,0.35)", backgroundColor: "rgba(201,160,110,0.1)", color: "#C9A06E" }}
                      >
                        <span>✓</span> {t.bookingConfirmedLabel}
                      </div>
                    )}
                  </div>
                ))}
                {sendChat.isPending && (
                  <div
                    className="self-start px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
                    style={{ backgroundColor: "rgba(249,244,238,0.06)", border: "1px solid rgba(201,160,110,0.12)" }}
                  >
                    {[0, 200, 400].map((d) => (
                      <div key={d} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#C9A06E", animation: `bounce 1s infinite ${d}ms` }} />
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t" style={{ borderColor: "rgba(201,160,110,0.15)", backgroundColor: "rgba(28,18,16,0.9)" }}>
                <div
                  className="relative flex items-end gap-2 rounded-xl p-2"
                  style={{ backgroundColor: "rgba(249,244,238,0.05)", border: "1px solid rgba(201,160,110,0.18)" }}
                >
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.placeholder}
                    className="flex-1 max-h-32 min-h-[44px] bg-transparent font-sans text-[15px] resize-none outline-none py-2 px-3 scrollbar-hide"
                    style={{ color: "#F9F4EE" }}
                    rows={1}
                    data-testid="widget-input"
                  />
                  <div className="flex gap-2 p-1">
                    <button
                      onClick={toggleListen}
                      className="p-2 rounded-lg transition-colors"
                      style={{
                        color: isListening ? "#C9A06E" : "#9E7B7B",
                        backgroundColor: isListening ? "rgba(201,160,110,0.15)" : "transparent",
                        animation: isListening ? "pulse 1.5s infinite" : "none",
                      }}
                      title={t.voiceTitle}
                      data-testid="widget-voice-btn"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
                      </svg>
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || sendChat.isPending}
                      className="p-2 rounded-lg transition-opacity disabled:opacity-40"
                      style={{ background: "linear-gradient(135deg, #C9A06E, #9E7B7B)", color: "#F9F4EE" }}
                      data-testid="widget-send-btn"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
