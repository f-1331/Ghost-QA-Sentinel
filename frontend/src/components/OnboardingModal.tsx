// frontend/src/components/OnboardingModal.tsx
// Dual-Mode Interactive Guide: Investor Pitch Deck & Technical QA Walkthrough
"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Bug, 
  BrainCircuit, 
  GitPullRequest, 
  Send, 
  Gamepad2, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  Zap,
  TrendingUp,
  DollarSign,
  Layers,
  Award,
  Database,
  Cpu,
  Flame
} from "lucide-react";
import { Language, translations } from "./i18n";
import { soundFX } from "./SoundEffects";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onStartDemoScan: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  lang,
  onStartDemoScan
}) => {
  const [mode, setMode] = useState<"investor" | "tech">("investor");
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const t = translations[lang] || translations.uz;

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // 1. INVESTOR PITCH DECK SLIDES
  const investorSlides = [
    {
      icon: <TrendingUp className="w-8 h-8 text-sentinel-cyan" />,
      badge: "INVESTOR DECK // SLIDE 1: THE $50B PROBLEM",
      title: "Global QA Muammosi va Katta Bozor (TAM: $50B+)",
      desc: "Dasturiy ta'minotni sinovdan o'tkazish (QA testing) global miqyosda 50 milliard dollarlik yirik bozor. Kompaniyalar bitta Senior QA muhandisiga yiliga $120,000 to'laydi, ammo insoniy omil tufayli xatolar baribir ishlab chiqarishga (production) sizib chiqadi.",
      visual: (
        <div className="bg-sentinel-bg border border-sentinel-border rounded-xl p-4 font-mono text-xs space-y-3">
          <div className="flex justify-between items-center text-gray-400 border-b border-gray-800 pb-2">
            <span className="text-red-400 font-bold">❌ An'anaviy QA Jamoasi</span>
            <span className="text-emerald-400 font-bold">✅ Ghost-QA Sentinel</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="bg-red-950/20 border border-red-900/40 p-2.5 rounded-lg space-y-1 text-red-300">
              <p>• Yillik xarajat: <b>$120,000+</b></p>
              <p>• Kechasi/dam olishda ishlamaydi</p>
              <p>• Xatoni tuzatish: <b>4 - 24 soat</b></p>
              <p>• Silent xatolarni o'tkazib yuboradi</p>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg space-y-1 text-emerald-300">
              <p>• Yillik xarajat: <b>$588 ($49/oy)</b></p>
              <p>• 24/7 uzluksiz avtonom bot</p>
              <p>• Xatoni tuzatish: <b>850 millisekund</b></p>
              <p>• 8 ta Red-Team hujumi bilan sinaydi</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <BrainCircuit className="w-8 h-8 text-purple-400" />,
      badge: "INVESTOR DECK // SLIDE 2: UNFAIR ADVANTAGE",
      title: "Bizning Yechim va Texnologik Ustunligimiz",
      desc: "Ghost-QA Sentinel — shunchaki test vositasi emas, balki kodni o'zi tahlil qilib tuzatuvchi to'liq avtonom agentdir. U 1-bosishda xatolik uchun toza Unified Git Diff yaratadi va GitHub ga Pull Request yuboradi.",
      visual: (
        <div className="bg-gradient-to-r from-purple-950/30 via-slate-900 to-cyan-950/30 border border-purple-500/40 rounded-xl p-4 font-mono text-xs space-y-2">
          <div className="flex items-center gap-2 text-purple-300 font-bold">
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
            <span>3-in-1 Avtonom Dvigatel:</span>
          </div>
          <div className="space-y-1.5 text-gray-300 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
              <span><b>1. Headless Playwright:</b> Brauzerda xatolarni 100ms da ushlash.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0"></span>
              <span><b>2. Chaos Red-Team:</b> 8 xil kiberhujum (SSRF, XSS, SQLi, Concurrency).</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
              <span><b>3. Google Gemini AI:</b> O'zini-o'zi tuzatuvchi toza kod va regressiya testlari.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <DollarSign className="w-8 h-8 text-emerald-400" />,
      badge: "INVESTOR DECK // SLIDE 3: 90% COST SAVINGS & ROI",
      title: "Xarajatlarni 90% Tejamkorligi (Mijoz ROI)",
      desc: "Kompaniyalar har bir reliz oldidan haftalab davom etadigan regressiya testlaridan xalos bo'ladi. Vaqt va resurs tejamkorligi tufayli Ghost-QA Sentinel birinchi oydanoq o'z xarajatini 20x qilib oqlaydi.",
      visual: (
        <div className="bg-sentinel-bg border border-sentinel-border rounded-xl p-4 font-mono text-xs space-y-3">
          <div className="flex justify-between text-gray-400 text-[11px]">
            <span>Tejamkorlik Ko'rsatkichi:</span>
            <span className="text-emerald-400 font-bold">90%+ Sof Tejamkorlik</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full w-[90%]" />
          </div>
          <p className="text-[11px] text-gray-400">
            Kompaniya yiliga <b>$119,412</b> tejab qoladi va reliz tezligi 10 barobarga oshadi!
          </p>
        </div>
      )
    },
    {
      icon: <Layers className="w-8 h-8 text-sentinel-cyan" />,
      badge: "INVESTOR DECK // SLIDE 4: ARCHITECTURE & CLOUD",
      title: "Masshtablanuvchi Bulut Arxitekturasi",
      desc: "Ghost-QA Sentinel Neon Tech Serverless PostgreSQL (AWS us-east-2), FastAPI asinxron backend va Rust AST moduli asosida qurilgan. Millionlab parallel test so'rovlarini 0 xotira yo'qotishi bilan qabul qiladi.",
      visual: (
        <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
          <div className="p-2.5 rounded-lg bg-black/60 border border-gray-800 space-y-1">
            <span className="text-cyan-400 font-bold block">☁️ Neon Serverless DB</span>
            <p className="text-gray-400">AWS us-east-2, avtomatik 0-to-1 compute, shifrlangan telemetriya.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-black/60 border border-gray-800 space-y-1">
            <span className="text-amber-400 font-bold block">⚡ Rust AST Speed</span>
            <p className="text-gray-400">50x tezkor diff taqqoslash va 10k parallel tarmoq monitoringi.</p>
          </div>
        </div>
      )
    },
    {
      icon: <Award className="w-8 h-8 text-amber-400" />,
      badge: "INVESTOR DECK // SLIDE 5: MONETIZATION & TRACTION",
      title: "Biznes Model va Monetizatsiya Tiers",
      desc: "Uch bosqichli SaaS biznes modeli orqali yuqori daromad va tezkor o'sish ta'minlanadi:",
      visual: (
        <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center">
          <div className="p-2 rounded-lg bg-black/60 border border-gray-800">
            <span className="text-gray-400 font-bold block">Developer</span>
            <span className="text-white text-xs font-black block mt-1">$0</span>
            <span className="text-gray-500 text-[9px]">5 skan/kun</span>
          </div>
          <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/50">
            <span className="text-cyan-400 font-bold block">Pro Startup</span>
            <span className="text-cyan-300 text-xs font-black block mt-1">$49/oy</span>
            <span className="text-gray-300 text-[9px]">Cheksiz 8x Red-Team</span>
          </div>
          <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/50">
            <span className="text-purple-400 font-bold block">Enterprise</span>
            <span className="text-purple-300 text-xs font-black block mt-1">$499+/oy</span>
            <span className="text-gray-300 text-[9px]">Maxsus CI/CD & SLA</span>
          </div>
        </div>
      )
    }
  ];

  // 2. TECHNICAL WALKTHROUGH SLIDES
  const techSlides = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-sentinel-cyan" />,
      badge: "STEP 1 // ARCHITECTURE",
      title: t.guideStep1Title,
      desc: t.guideStep1Desc,
      visual: (
        <div className="bg-sentinel-bg border border-sentinel-border rounded-xl p-4 font-mono text-xs space-y-2">
          <div className="flex items-center gap-2 text-sentinel-cyan">
            <Terminal className="w-4 h-4" />
            <span>Problem vs Ghost-QA Solution</span>
          </div>
          <div className="text-red-400 bg-red-950/30 p-2 rounded border border-red-800/40">
            ❌ <b>Traditional Testing:</b> Manual QA testers miss silent console errors, 500s on async fetches, and layout overlaps.
          </div>
          <div className="text-emerald-400 bg-emerald-950/30 p-2 rounded border border-emerald-800/40">
            ✅ <b>Ghost-QA Sentinel:</b> Autonomous bot crawls 24/7, detects exceptions in 100ms, and heals code with Gemini AI.
          </div>
        </div>
      )
    },
    {
      icon: <Bug className="w-8 h-8 text-rose-500" />,
      badge: "STEP 2 // CHAOS ENGINE",
      title: t.guideStep2Title,
      desc: t.guideStep2Desc,
      visual: (
        <div className="bg-sentinel-bg border border-sentinel-border rounded-xl p-4 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400 pb-1 border-b border-gray-800">
            <span className="text-sentinel-emerald">🕷️ Playwright Chromium Headless</span>
            <span className="text-[10px] text-gray-500">1280x800 Viewport</span>
          </div>
          <div className="space-y-1 text-gray-300">
            <p className="text-amber-400">⚡ Chaos Monkey: Clicking button#checkout-btn...</p>
            <p className="text-red-400">💥 Intercepted: TypeError: calculateGrandTotal is not a function</p>
            <p className="text-purple-400">📸 Snapshot saved: /screenshots/demo_checkout.png</p>
          </div>
        </div>
      )
    },
    {
      icon: <BrainCircuit className="w-8 h-8 text-purple-400" />,
      badge: "STEP 3 // AI DIAGNOSTICS",
      title: t.guideStep3Title,
      desc: t.guideStep3Desc,
      visual: (
        <div className="bg-sentinel-bg border border-sentinel-border rounded-xl p-4 font-mono text-xs space-y-2">
          <div className="flex items-center gap-2 text-purple-400">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Google Gemini Multi-Model Neural Healer</span>
          </div>
          <div className="bg-purple-950/20 border border-purple-800/40 rounded p-2 text-gray-300 text-[11px] leading-relaxed">
            <span className="text-purple-300 font-bold">Root Cause:</span> Cart state dereferences <code>.pricing</code> on undefined object.
            <br />
            <span className="text-emerald-300 font-bold">Fix Strategy:</span> Optional chaining + fallback reduce accumulator.
          </div>
        </div>
      )
    },
    {
      icon: <GitPullRequest className="w-8 h-8 text-emerald-400" />,
      badge: "STEP 4 // SELF-HEALING",
      title: t.guideStep4Title,
      desc: t.guideStep4Desc,
      visual: (
        <div className="bg-sentinel-bg border border-sentinel-border rounded-xl p-3 font-mono text-xs">
          <div className="text-gray-400 mb-1 text-[11px] flex items-center justify-between">
            <span>demo-broken-app/app.js (Unified Diff)</span>
            <span className="text-emerald-400 font-bold">READY TO APPLY</span>
          </div>
          <div className="bg-black/50 p-2 rounded text-[11px] space-y-0.5">
            <div className="text-red-400 bg-red-950/40 px-1">- const grandTotal = cart.checkoutDetails.pricing.calculateGrandTotal();</div>
            <div className="text-emerald-400 bg-emerald-950/40 px-1">+ const grandTotal = (cart.checkoutDetails?.pricing) ? ... : items.reduce();</div>
          </div>
        </div>
      )
    },
    {
      icon: <Send className="w-8 h-8 text-[#38bdf8]" />,
      badge: "STEP 5 // TELEGRAM ALERTS",
      title: t.guideStep5Title,
      desc: t.guideStep5Desc,
      visual: (
        <div className="bg-sentinel-bg border border-sentinel-border rounded-xl p-3 font-mono text-xs space-y-2">
          <div className="flex items-center gap-2 text-[#38bdf8]">
            <Send className="w-4 h-4" />
            <span>Telegram Bot: @ghost_qa_sentinel_bot</span>
          </div>
          <div className="bg-[#0088cc]/10 border border-[#0088cc]/30 p-2 rounded text-[11px] text-gray-300">
            🚨 <b>CRITICAL DEFECT DETECTED</b><br/>
            Target: <code>CyberMart /checkout</code><br/>
            AI Solution: <i>Patch generated in 820ms!</i><br/>
            Buttons: [Apply Patch] [View Diff] [Open Web App]
          </div>
        </div>
      )
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-sentinel-amber" />,
      badge: "STEP 6 // INSTANT DEMO",
      title: t.guideStep6Title,
      desc: t.guideStep6Desc,
      visual: (
        <div className="bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-purple-950/40 border border-emerald-500/40 rounded-xl p-4 text-center space-y-3">
          <p className="text-xs font-mono text-emerald-300">
            CyberMart Sandbox 4 ta sun'iy xatolik bilan tayyor turibdi!
          </p>
          <button
            onClick={() => {
              soundFX.playScanStart();
              onClose();
              onStartDemoScan();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sentinel-emerald via-teal-500 to-sentinel-cyan text-black font-black text-sm tracking-wide shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-black fill-black" />
            <span>{t.guideTryDemoBtn}</span>
          </button>
        </div>
      )
    }
  ];

  const currentSlides = mode === "investor" ? investorSlides : techSlides;
  const step = currentSlides[Math.min(currentStep, currentSlides.length - 1)];

  const handleNext = () => {
    soundFX.playClick();
    if (currentStep < currentSlides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    soundFX.playClick();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-sentinel-surface border border-sentinel-cyan/40 rounded-2xl max-w-2xl w-full shadow-2xl shadow-sentinel-cyan/15 overflow-hidden flex flex-col my-auto max-h-[96vh] sm:max-h-[92vh] shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Mode Toggle & Close */}
        <div className="p-3 sm:p-5 border-b border-sentinel-border bg-sentinel-card/60 flex flex-col gap-3 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-sentinel-cyan/15 border border-sentinel-cyan/40 flex items-center justify-center shrink-0">
                {step.icon}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono tracking-widest text-sentinel-cyan font-bold block truncate">
                  {step.badge}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  {mode === "investor" ? "Ghost-QA Sentinel Investor Whitepaper" : t.guideModalTitle}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-red-500/15 hover:bg-red-500/30 border border-red-500/40 text-red-300 hover:text-white transition-all text-xs font-mono font-bold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Yopish</span>
            </button>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex items-center bg-black/50 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => {
                soundFX.playClick();
                setMode("investor");
                setCurrentStep(0);
              }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === "investor"
                  ? "bg-gradient-to-r from-sentinel-cyan to-teal-400 text-black shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>💼 Investor Pitch & ROI</span>
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setMode("tech");
                setCurrentStep(0);
              }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === "tech"
                  ? "bg-gradient-to-r from-sentinel-cyan to-teal-400 text-black shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>📖 Texnik Qo'llanma</span>
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 sm:grid-cols-6 h-1 bg-sentinel-bg shrink-0">
          {currentSlides.map((_, idx) => (
            <div
              key={idx}
              className={`h-full transition-all duration-300 ${
                idx <= currentStep ? "bg-sentinel-cyan" : "bg-transparent"
              }`}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 flex-1">
          <h3 className="text-sm sm:text-base font-bold text-gray-100 flex items-center gap-2">
            <span>{step.title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
            {step.desc}
          </p>

          {/* Interactive visual snippet */}
          <div className="pt-1 sm:pt-2">
            {step.visual}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-3 sm:p-4 border-t border-sentinel-border bg-sentinel-card/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            {currentSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundFX.playClick();
                  setCurrentStep(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? "bg-sentinel-cyan scale-125"
                    : "bg-gray-700 hover:bg-gray-500"
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-sentinel-card hover:bg-sentinel-border text-xs text-gray-300 transition-all flex items-center gap-1 font-mono cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t.guidePrevBtn}</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl bg-sentinel-cyan text-black hover:bg-cyan-300 font-bold text-xs tracking-wide transition-all flex items-center gap-1 font-mono shadow-md shadow-sentinel-cyan/20 cursor-pointer"
            >
              <span>{currentStep === currentSlides.length - 1 ? t.guideFinishBtn : t.guideNextBtn}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
