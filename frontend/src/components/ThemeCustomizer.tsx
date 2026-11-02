// frontend/src/components/ThemeCustomizer.tsx
"use client";

import React from "react";
import { 
  Palette, 
  X, 
  Check, 
  Sparkles, 
  Terminal, 
  Flame, 
  Moon, 
  Sun, 
  Eye, 
  Tv, 
  Layers,
  ShieldCheck
} from "lucide-react";
import { Language, translations } from "./i18n";
import { BgEffect } from "./BackgroundCanvas";
import { soundFX } from "./SoundEffects";

export type ThemeId = 
  | "cyberpunk" 
  | "matrix" 
  | "synthwave" 
  | "midnight" 
  | "bloodmoon" 
  | "nordic" 
  | "solar";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  accent: string;
  badge: string;
  gradient: string;
  previewBg: string;
}

export const AVAILABLE_THEMES: ThemeConfig[] = [
  {
    id: "cyberpunk",
    name: "Cyberpunk Obsidian",
    accent: "#06b6d4",
    badge: "CYBERPUNK",
    gradient: "from-cyan-500 to-blue-600",
    previewBg: "bg-[#080c14] border-cyan-500/40"
  },
  {
    id: "matrix",
    name: "Matrix Terminal",
    accent: "#10b981",
    badge: "HACKER",
    gradient: "from-emerald-500 to-green-600",
    previewBg: "bg-[#050906] border-emerald-500/50"
  },
  {
    id: "synthwave",
    name: "Synthwave 80s Sunset",
    accent: "#ec4899",
    badge: "RETROWAVE",
    gradient: "from-fuchsia-500 via-pink-500 to-amber-500",
    previewBg: "bg-[#0e0720] border-pink-500/40"
  },
  {
    id: "midnight",
    name: "Midnight Deep Command",
    accent: "#3b82f6",
    badge: "STEALTH NAVY",
    gradient: "from-blue-600 to-indigo-700",
    previewBg: "bg-[#040817] border-blue-500/40"
  },
  {
    id: "bloodmoon",
    name: "Blood Moon Security",
    accent: "#ef4444",
    badge: "ALERT CRITICAL",
    gradient: "from-red-600 to-rose-700",
    previewBg: "bg-[#140505] border-red-500/50"
  },
  {
    id: "nordic",
    name: "Stealth Nordic Slate",
    accent: "#94a3b8",
    badge: "MINIMALIST",
    gradient: "from-slate-400 to-zinc-600",
    previewBg: "bg-[#0b0f19] border-slate-600/40"
  },
  {
    id: "solar",
    name: "Solar Flare Gold",
    accent: "#eab308",
    badge: "COSMIC GOLD",
    gradient: "from-amber-400 to-yellow-600",
    previewBg: "bg-[#120f05] border-amber-500/50"
  }
];

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  currentBgEffect: BgEffect;
  onSelectBgEffect: (effect: BgEffect) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  isOpen,
  onClose,
  lang,
  currentTheme,
  onSelectTheme,
  currentBgEffect,
  onSelectBgEffect
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  const bgEffects: { id: BgEffect; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: "matrix",
      label: t.bgEffectMatrixRain,
      icon: <Terminal className="w-5 h-5 text-emerald-400" />,
      desc: "Live falling alphanumeric hacker rain in green"
    },
    {
      id: "grid",
      label: t.bgEffectCyberGrid,
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      desc: "Perspective scrolling cybernetic grid lines"
    },
    {
      id: "particles",
      label: t.bgEffectParticles,
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      desc: "Connected glowing floating nodes"
    },
    {
      id: "scanline",
      label: t.bgEffectScanline,
      icon: <Tv className="w-5 h-5 text-amber-400" />,
      desc: "Classic 80s cathode tube CRT scanline flicker"
    },
    {
      id: "minimal",
      label: t.bgEffectMinimal,
      icon: <Moon className="w-5 h-5 text-gray-400" />,
      desc: "Dark background with no animations for maximum focus"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-sentinel-surface border border-sentinel-border rounded-2xl max-w-xl w-full shadow-2xl shadow-sentinel-cyan/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-sentinel-border bg-sentinel-card/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sentinel-cyan/10 border border-sentinel-cyan/30 flex items-center justify-center">
              <Palette className="w-5 h-5 text-sentinel-cyan" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-sentinel-cyan block">
                CUSTOMIZER v2.0
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {t.themeModalTitle}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-sentinel-border transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* 1. Theme Color Palettes */}
          <div>
            <h3 className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-sentinel-cyan" />
              <span>{t.themesSectionTitle}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_THEMES.map((theme) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      soundFX.playClick();
                      onSelectTheme(theme.id);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-sentinel-card border-sentinel-cyan ring-1 ring-sentinel-cyan shadow-lg shadow-sentinel-cyan/20"
                        : "bg-sentinel-bg hover:bg-sentinel-card border-sentinel-border hover:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-sm`}
                      />
                      <div>
                        <div className="text-xs font-bold text-gray-200">
                          {theme.name}
                        </div>
                        <div className="text-[10px] font-mono text-gray-400">
                          {theme.badge}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-sentinel-cyan" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Background Animation Effects */}
          <div>
            <h3 className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-sentinel-purple" />
              <span>{t.bgEffectsSectionTitle}</span>
            </h3>

            <div className="space-y-2">
              {bgEffects.map((effect) => {
                const isSelected = currentBgEffect === effect.id;
                return (
                  <button
                    key={effect.id}
                    onClick={() => {
                      soundFX.playClick();
                      onSelectBgEffect(effect.id);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-sentinel-card border-sentinel-purple ring-1 ring-sentinel-purple shadow-lg shadow-sentinel-purple/20"
                        : "bg-sentinel-bg hover:bg-sentinel-card border-sentinel-border hover:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-sentinel-surface border border-sentinel-border">
                        {effect.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-200">
                          {effect.label}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {effect.desc}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-sentinel-purple" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sentinel-border bg-sentinel-card/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sentinel-cyan text-black hover:bg-cyan-300 font-bold text-xs font-mono transition-all shadow-md shadow-sentinel-cyan/20"
          >
            {t.closeBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
