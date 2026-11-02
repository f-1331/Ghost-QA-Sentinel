// frontend/src/components/OnboardingModal.tsx
"use client";

import React, { useState } from "react";
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
  Zap
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
  const [currentStep, setCurrentStep] = useState(0);
  const t = translations[lang];

  if (!isOpen) return null;

  const steps = [
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
            <span>Google Gemini 3.8 Flash Neural Healer</span>
          </div>
          <div className="bg-purple-950/20 border border-purple-800/40 rounded p-2 text-gray-300 text-[11px] leading-relaxed">
            <span className="text-purple-300 font-bold">Root Cause:</span> Cart state dereferences `.pricing` on undefined object.
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
            AI Solution: <i>Patch generated in 1.2s!</i><br/>
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
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sentinel-emerald via-teal-500 to-sentinel-cyan text-black font-black text-sm tracking-wide shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-black fill-black" />
            <span>{t.guideTryDemoBtn}</span>
          </button>
        </div>
      )
    }
  ];

  const step = steps[currentStep];

  const handleNext = () => {
    soundFX.playClick();
    if (currentStep < steps.length - 1) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-sentinel-surface border border-sentinel-border rounded-2xl max-w-2xl w-full shadow-2xl shadow-sentinel-cyan/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-sentinel-border bg-sentinel-card/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sentinel-cyan/10 border border-sentinel-cyan/30 flex items-center justify-center">
              {step.icon}
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-sentinel-cyan block">
                {step.badge}
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {t.guideModalTitle}
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

        {/* Step Progress Bar */}
        <div className="grid grid-cols-6 h-1 bg-sentinel-bg">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-full transition-all duration-300 ${
                idx <= currentStep ? "bg-sentinel-cyan" : "bg-transparent"
              }`}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
            <span>{step.title}</span>
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed font-sans">
            {step.desc}
          </p>

          {/* Interactive visual snippet */}
          <div className="pt-2">
            {step.visual}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-sentinel-border bg-sentinel-card/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundFX.playClick();
                  setCurrentStep(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentStep
                    ? "bg-sentinel-cyan scale-125"
                    : "bg-gray-700 hover:bg-gray-500"
                }`}
                title={`Step ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 rounded-xl bg-sentinel-card hover:bg-sentinel-border text-xs text-gray-300 transition-all flex items-center gap-1 font-mono"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t.guidePrevBtn}</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-sentinel-cyan text-black hover:bg-cyan-300 font-bold text-xs tracking-wide transition-all flex items-center gap-1 font-mono shadow-md shadow-sentinel-cyan/20"
            >
              <span>{currentStep === steps.length - 1 ? t.guideFinishBtn : t.guideNextBtn}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
