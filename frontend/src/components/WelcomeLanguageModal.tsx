// frontend/src/components/WelcomeLanguageModal.tsx
// High-tech Cyberpunk First-Visit Language Selection Modal
"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  X,
  Zap,
  Activity,
  Layers
} from "lucide-react";
import { Language, translations } from "./i18n";
import { soundFX } from "./SoundEffects";

interface WelcomeLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const WelcomeLanguageModal: React.FC<WelcomeLanguageModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLanguage
}) => {
  const [selectedLang, setSelectedLang] = useState<Language>(currentLang);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSelectedLang(currentLang);
  }, [currentLang]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const t = translations[selectedLang] || translations.uz;

  const languagesList: {
    code: Language;
    title: string;
    nativeName: string;
    flag: string;
    badge: string;
    desc: string;
    highlight: string;
  }[] = [
    {
      code: "uz",
      title: "O'zbekcha",
      nativeName: "O'zbek tili",
      flag: "🇺🇿",
      badge: "STANDART",
      desc: "To'liq o'zbekcha interfeys, avtonom skanlar, AI diagnostika va muhandislik Copilot bilan samimiy muloqot.",
      highlight: "100% Mahalliylashtirilgan"
    },
    {
      code: "en",
      title: "English",
      nativeName: "Global English",
      flag: "🇬🇧",
      badge: "GLOBAL STANDARD",
      desc: "Full English interface, automated Playwright test suites, multi-vector Red-Team security audits & AI.",
      highlight: "Production Ready"
    },
    {
      code: "ru",
      title: "Русский",
      nativeName: "Русский язык",
      flag: "🇷🇺",
      badge: "ПОЛНЫЙ ПЕРЕВОД",
      desc: "Интерфейс на русском языке, E2E тесты, аудит уязвимостей и автономное исправление через Google Gemini.",
      highlight: "Полная Адаптация"
    }
  ];

  const handleCardClick = (code: Language) => {
    soundFX.playClick();
    setSelectedLang(code);
    onSelectLanguage(code);
  };

  const handleConfirm = () => {
    soundFX.playHealedChime();
    try {
      localStorage.setItem("ghostqa_lang", selectedLang);
      localStorage.setItem("ghostqa_lang_selected", "true");
    } catch (e) {}
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[1100] flex flex-col items-center justify-start sm:justify-center p-3 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto animate-fadeIn"
      onClick={handleConfirm}
    >
      <div 
        className="max-w-2xl w-full bg-[#0a0f1d] border-2 border-sentinel-cyan/50 rounded-2xl shadow-2xl shadow-sentinel-cyan/25 overflow-hidden flex flex-col my-auto shrink-0 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-sentinel-cyan to-transparent animate-pulse" />
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-sentinel-border bg-gradient-to-b from-[#0f172a] to-[#0a0f1d] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-sentinel-cyan/20 border border-sentinel-cyan/40 flex items-center justify-center shadow-lg shadow-sentinel-cyan/20 shrink-0">
              <Globe className="w-6 h-6 text-sentinel-cyan animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-sentinel-cyan font-bold uppercase">
                  INITIALIZATION // LANGUAGE SELECTOR
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono font-bold">
                  v3.0 READY
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                {t.welcomeModalTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-sentinel-border transition-all cursor-pointer"
            title="Close / Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
            {t.welcomeLanguagePrompt}
          </p>

          {/* 3 Interactive Language Cards */}
          <div className="grid grid-cols-1 gap-3">
            {languagesList.map((item) => {
              const isSelected = selectedLang === item.code;
              return (
                <div
                  key={item.code}
                  onClick={() => handleCardClick(item.code)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group flex items-start gap-4 ${
                    isSelected
                      ? "bg-gradient-to-r from-sentinel-cyan/15 via-[#0f2338] to-[#0c1a29] border-sentinel-cyan ring-1 ring-sentinel-cyan shadow-lg shadow-sentinel-cyan/20"
                      : "bg-[#070b14] border-gray-800/80 hover:border-gray-700 hover:bg-[#0c1222]"
                  }`}
                >
                  <div className="text-3xl sm:text-4xl shrink-0 p-1 bg-black/40 rounded-xl border border-gray-800 flex items-center justify-center">
                    {item.flag}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                          {item.title}
                        </h3>
                        <span className="text-[10px] font-mono text-gray-400">
                          ({item.nativeName})
                        </span>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        isSelected 
                          ? "bg-sentinel-cyan text-black" 
                          : "bg-gray-800 text-gray-400"
                      }`}>
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed font-sans line-clamp-2">
                      {item.desc}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-sentinel-cyan">
                      <Sparkles className="w-3 h-3" />
                      <span>{item.highlight}</span>
                    </div>
                  </div>

                  <div className="shrink-0 self-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-sentinel-cyan border-sentinel-cyan text-black"
                        : "border-gray-700 bg-black/40 text-transparent"
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5 fill-black" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick System Badge */}
          <div className="bg-black/50 border border-gray-800/80 rounded-xl p-3 flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ghost-QA Sentinel Engine v3.0</span>
            </span>
            <span className="text-sentinel-cyan font-bold">
              {t.systemRatingBadge}
            </span>
          </div>
        </div>

        {/* Footer with Confirm Button */}
        <div className="p-4 sm:p-5 border-t border-sentinel-border bg-gradient-to-t from-[#060a12] to-[#0a0f1d] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-gray-400 flex items-center gap-2">
            <span>Tanlangan til:</span>
            <span className="text-sentinel-cyan font-bold uppercase">{selectedLang}</span>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sentinel-cyan via-teal-400 to-sentinel-cyan text-black font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-sentinel-cyan/25 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-mono"
          >
            <span>{t.launchSentinelBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
