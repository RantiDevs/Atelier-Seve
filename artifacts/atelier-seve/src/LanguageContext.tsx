import { createContext, useContext, useState, type ReactNode } from "react";
import { translations, type Lang, type T } from "./i18n";

interface LanguageContextValue {
  lang: Lang;
  t: T;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "it",
  t: translations.it,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("it");

  const toggleLang = () => setLang((l) => (l === "it" ? "en" : "it"));

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
