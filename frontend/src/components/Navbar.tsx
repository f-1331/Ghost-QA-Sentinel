// frontend/src/components/Navbar.tsx
"use client";

import React, { useState } from "react";
import { 
  Shield, 
  Radio, 
  Terminal, 
  Bot, 
  Github, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  FileDown, 
  Send,
  Gamepad2,
  BookOpen,
  Palette,
  Globe,
  Sparkles,
  Workflow,
  Swords
} from "lucide-react";
import { soundFX } from "./SoundEffects";
import { Language, translations } from "./i18n";
import { ThemeId } from "./ThemeCustomizer";

interface NavbarProps {
  systemHealth: {
    browser_engine?: string;
    gemini_active?: boolean;
    github_active?: boolean;
    telegram_active?: boolean;
    simulation_mode?: boolean;
  } | null;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenGuideModal: () => void;
  onOpenThemeModal: () => void;
  onOpenSandboxModal: () => void;
  onOpenCiCdModal: () => void;
  onOpenAttackbenchModal: () => void;
  onExportReport: () => void;
  currentTheme: ThemeId;
}

export const Navbar: React.FC<NavbarProps> = ({
  systemHealth,
  lang,
  onLanguageChange,
  onOpenGuideModal,
  onOpenThemeModal,
  onOpenSandboxModal,
  onOpenCiCdModal,
  onOpenAttackbenchModal,
  onExportReport,
  currentTheme
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const t = translations[lang];

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundFX.enabled = newState;
    if (newState) {
      soundFX.playHealedChime();
    }
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ru", label: "Русский", flag: "🇷🇺" }
  ];

  return (
    <header className="border-b border-sentinel-border bg-sentinel-surface/85 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sentinel-cyan via-blue-600 to-sentinel-purple flex items-center justify-center shadow-lg shadow-sentinel-cyan/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sentinel-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sentinel-emerald"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                GHOST<span className="text-sentinel-cyan">QA</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sentinel-cyan/10 border border-sentinel-cyan/30 text-sentinel-cyan font-mono font-normal">
                  SENTINEL v2.0
                </span>
              </h1>
            </div>
            <p className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sentinel-emerald animate-pulse"></span>
              {t.brandSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          
          {/* Guide / Instructions Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenGuideModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sentinel-cyan/15 border border-sentinel-cyan/40 text-sentinel-cyan hover:bg-sentinel-cyan/25 transition-all font-sans font-medium shadow-sm shadow-sentinel-cyan/10"
            title="Interactive First-time User Guide"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.guideBtn}</span>
          </button>

          {/* Theme & Background Customizer Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenThemeModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sentinel-purple/15 border border-sentinel-purple/40 text-purple-400 hover:bg-sentinel-purple/25 transition-all font-sans font-medium"
            title="Switch Background Themes & Effects"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{t.themesBtn}</span>
          </button>

          {/* Telegram Bot Direct Pill */}
          <a
            href="https://t.me/ghost_qa_sentinel_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0088cc]/20 border border-[#0088cc]/50 text-[#38bdf8] hover:bg-[#0088cc]/30 transition-all font-sans font-medium"
            title="Open Telegram Sentinel Bot (@ghost_qa_sentinel_bot)"
          >
            <Send className="w-3.5 h-3.5" />
            <span>@ghost_qa_sentinel_bot</span>
          </a>

          {/* Interactive Sandbox Testbench Modal Trigger */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenSandboxModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 transition-all font-sans font-medium"
            title="Open Interactive Sandbox Target Testbench"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>{t.sandboxBtn}</span>
          </button>

          {/* CI/CD Pipeline Automation Trigger */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenCiCdModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/25 transition-all font-sans font-medium"
            title="CI/CD GitHub Actions & Webhook Setup"
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>CI/CD</span>
          </button>

          {/* Autonomous Chaos & Security Attackbench Trigger */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenAttackbenchModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/40 text-rose-400 hover:bg-red-500/25 transition-all font-sans font-medium"
            title="Autonomous Chaos & Security Attackbench"
          >
            <Swords className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Attackbench</span>
          </button>

          {/* Export Audit Report */}
          <button
            onClick={() => {
              soundFX.playClick();
              onExportReport();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sentinel-card hover:bg-sentinel-border border border-sentinel-border text-gray-200 hover:text-white transition-all font-sans"
            title="Download Full Markdown Audit Report"
          >
            <FileDown className="w-3.5 h-3.5 text-sentinel-cyan" />
            <span>{t.exportBtn}</span>
          </button>

          {/* Multi-language Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sentinel-card hover:bg-sentinel-border border border-sentinel-border text-gray-200 hover:text-white transition-all font-sans"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-sentinel-cyan" />
              <span className="uppercase font-bold">{lang}</span>
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-sentinel-card border border-sentinel-border rounded-xl shadow-xl z-50 p-1 font-sans">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      soundFX.playClick();
                      onLanguageChange(item.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg text-left transition-all ${
                      lang === item.code
                        ? "bg-sentinel-cyan/15 text-sentinel-cyan font-bold"
                        : "text-gray-300 hover:bg-sentinel-surface hover:text-white"
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Audio FX Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled
                ? "bg-sentinel-card border-sentinel-cyan/40 text-sentinel-cyan"
                : "bg-sentinel-card border-gray-800 text-gray-500"
            }`}
            title={soundEnabled ? t.muteFx : t.unmuteFx}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

        </div>
      </div>
    </header>
  );
};
