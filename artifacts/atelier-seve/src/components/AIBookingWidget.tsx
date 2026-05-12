import { useState, useRef, useEffect } from "react";
import { useSendChat, ChatMessage, ChatMessageRole } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/LanguageContext";

export function AIBookingWidget() {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: ChatMessageRole.assistant, content: t.widget.welcome },
  ]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendChat = useSendChat();

  useEffect(() => {
    setMessages([{ role: ChatMessageRole.assistant, content: t.widget.welcome }]);
  }, [lang]);

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
          utterance.lang = t.widget.speechLang;
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
      alert(t.widget.voiceNotSupported);
      return;
    }
    if (isListening) { setIsListening(false); return; }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = t.widget.speechLang;
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
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-secondary to-border shadow-[0_0_20px_rgba(201,160,110,0.4)] flex items-center justify-center z-40 transition-transform hover:scale-105"
        data-testid="widget-open-btn"
      >
        <div className="absolute inset-0 rounded-full border border-border animate-ping opacity-30" />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
          <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/15 backdrop-blur-2xl"
          >
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-[600px] h-[80vh] bg-foreground rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-border/20"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/20 bg-foreground/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-serif text-foreground">C</div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-foreground" />
                  </div>
                  <h3 className="font-serif italic text-xl text-background">{t.widget.title}</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-background transition-colors p-2" data-testid="widget-close-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-hide">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col max-w-[85%] ${msg.role === ChatMessageRole.user ? "self-end items-end" : "self-start items-start"}`}>
                    <div className={`px-5 py-3 rounded-2xl font-sans text-[15px] leading-relaxed shadow-sm ${
                      msg.role === ChatMessageRole.user
                        ? "bg-muted text-background rounded-tr-sm"
                        : "bg-background text-foreground rounded-tl-sm"
                    }`}>
                      {msg.content}
                    </div>
                    {msg.content.toLowerCase().includes(t.widget.bookingConfirmedKeyword) && msg.role === ChatMessageRole.assistant && (
                      <div className="mt-3 px-4 py-3 border border-border rounded-lg bg-background/5 text-background font-sans text-sm flex items-center gap-2">
                        <span className="text-border">✓</span> {t.widget.bookingConfirmedLabel}
                      </div>
                    )}
                  </div>
                ))}
                {sendChat.isPending && (
                  <div className="self-start px-5 py-4 rounded-2xl rounded-tl-sm bg-background text-foreground flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-border animate-[bounce_1s_infinite_0ms]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-border animate-[bounce_1s_infinite_200ms]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-border animate-[bounce_1s_infinite_400ms]" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border/20 bg-foreground">
                <div className="relative flex items-end gap-2 bg-background/5 rounded-xl p-2 border border-border/20 focus-within:border-border/50 transition-colors">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.widget.placeholder}
                    className="flex-1 max-h-32 min-h-[44px] bg-transparent text-background placeholder:text-muted-foreground font-sans text-[15px] resize-none outline-none py-2 px-3 scrollbar-hide"
                    rows={1}
                    data-testid="widget-input"
                  />
                  <div className="flex gap-2 p-1">
                    <button
                      onClick={toggleListen}
                      className={`p-2 rounded-lg transition-colors ${isListening ? "bg-secondary text-foreground animate-pulse" : "text-muted-foreground hover:bg-background/10 hover:text-background"}`}
                      title={t.widget.voiceTitle}
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
                      className="p-2 rounded-lg bg-secondary text-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
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
