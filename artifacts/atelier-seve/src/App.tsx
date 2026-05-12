import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { CustomCursor } from "@/components/CustomCursor";
import HomePage from "@/pages/HomePage";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useState } from "react";

const queryClient = new QueryClient();

function LangToggle() {
  const { lang, toggleLang } = useLanguage();
  return (
    <button
      onClick={toggleLang}
      className="fixed top-5 right-5 z-[60] flex items-center gap-1 font-sans text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border transition-all duration-300"
      style={{
        borderColor: "rgba(201,160,110,0.5)",
        backgroundColor: "rgba(28,18,16,0.82)",
        color: "#C9A06E",
        backdropFilter: "blur(8px)",
      }}
      aria-label="Switch language"
    >
      <span style={{ opacity: lang === "it" ? 1 : 0.4, transition: "opacity 0.2s" }}>IT</span>
      <span style={{ color: "rgba(201,160,110,0.35)", margin: "0 2px" }}>|</span>
      <span style={{ opacity: lang === "en" ? 1 : 0.4, transition: "opacity 0.2s" }}>EN</span>
    </button>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <LanguageProvider>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <CustomCursor />
            <LangToggle />
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
