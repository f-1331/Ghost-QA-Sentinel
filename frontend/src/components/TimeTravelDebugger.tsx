// frontend/src/components/TimeTravelDebugger.tsx
"use client";

import React, { useState } from "react";
import { 
  Play, 
  RotateCcw, 
  Clock, 
  Bug, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Terminal,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Flame
} from "lucide-react";
import { Language, translations } from "./i18n";
import { soundFX } from "./SoundEffects";

export interface TimelineStep {
  timeOffset: string;
  type: "NAVIGATION" | "CHAOS_CLICK" | "ERROR_INTERCEPT" | "AI_HEALING" | "PATCH_VERIFIED";
  title: string;
  detail: string;
  target?: string;
  status: "OK" | "CRASH" | "HEALED";
  codeSnippet?: string;
  screenshotUrl?: string;
}

const DEFAULT_TIMELINE_STEPS: TimelineStep[] = [
  {
    timeOffset: "00:00.08",
    type: "NAVIGATION",
    title: "Chromium Viewport Initialized",
    detail: "Headless Chromium 1280x800 launched. Navigation to target /sandbox returned HTTP 200 OK with DOMContentLoaded.",
    target: "window.location",
    status: "OK"
  },
  {
    timeOffset: "00:00.64",
    type: "CHAOS_CLICK",
    title: "Chaos Interaction Dispatched",
    detail: "Autonomous agent simulated real-world user pointer event on interactive checkout element.",
    target: "button#checkout-btn",
    status: "OK"
  },
  {
    timeOffset: "00:00.72",
    type: "ERROR_INTERCEPT",
    title: "Runtime TypeError Intercepted",
    detail: "Playwright console listener caught unhandled TypeError: Cannot read properties of undefined (reading 'pricing').",
    target: "app.js:32",
    status: "CRASH",
    codeSnippet: "const grandTotal = cart.checkoutDetails.pricing.calculateGrandTotal();",
    screenshotUrl: "/screenshots/demo_checkout.png"
  },
  {
    timeOffset: "00:01.35",
    type: "AI_HEALING",
    title: "Gemini 3.8 Flash Neural Synthesis",
    detail: "Neural model analyzed call-site AST. Synthesized null-safe optional chaining fallback with cart item reducer.",
    target: "demo-broken-app/app.js",
    status: "HEALED",
    codeSnippet: "const grandTotal = (cart.checkoutDetails?.pricing?.calculateGrandTotal)\n  ? cart.checkoutDetails.pricing.calculateGrandTotal()\n  : cart.items.reduce((sum, item) => sum + item.price, 0).toFixed(2);"
  },
  {
    timeOffset: "00:01.88",
    type: "PATCH_VERIFIED",
    title: "Self-Healing Patch Verified",
    detail: "Re-executed checkout sequence in sandbox. Zero console errors. Transaction completed with 200 OK.",
    target: "button#checkout-btn",
    status: "HEALED"
  }
];

interface TimeTravelDebuggerProps {
  lang: Language;
}

export const TimeTravelDebugger: React.FC<TimeTravelDebuggerProps> = ({ lang }) => {
  const [activeStepIdx, setActiveStepIdx] = useState(2); // Default to the crash point
  const steps = DEFAULT_TIMELINE_STEPS;
  const currentStep = steps[activeStepIdx];

  const handleSelectStep = (idx: number) => {
    soundFX.playClick();
    setActiveStepIdx(idx);
  };

  const getStatusBadge = (status: TimelineStep["status"]) => {
    switch (status) {
      case "CRASH":
        return <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-mono font-bold">CRASH CAUGHT</span>;
      case "HEALED":
        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold">AI HEALED</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] font-mono font-bold">PASSED</span>;
    }
  };

  return (
    <div className="bg-sentinel-surface border border-sentinel-border rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sentinel-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sentinel-cyan/15 border border-sentinel-cyan/30 flex items-center justify-center">
            <Clock className="w-4 h-4 text-sentinel-cyan" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <span>VISUAL ACTION REPLAY & TIME-TRAVEL DEBUGGER</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sentinel-purple/15 text-purple-400 border border-sentinel-purple/30">
                PRO FEATURE
              </span>
            </h3>
            <p className="text-xs text-gray-400 font-sans">
              {lang === "uz" 
                ? "Chaos crawler ning har bir mikrosoniyadagi harakati va xatolik ro'y bergan daqiqani tahlil qiling"
                : lang === "ru"
                ? "Покадровое воспроизведение действий краулера и момента перехвата исключения"
                : "Microsecond replay of Playwright crawler interactions, exception freeze-frames, and AI patches"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
          <span>Active Frame:</span>
          <span className="text-sentinel-cyan font-bold">{currentStep.timeOffset}</span>
        </div>
      </div>

      {/* Interactive Horizontal Timeline Scrubber */}
      <div className="relative pt-2 pb-1">
        <div className="grid grid-cols-5 gap-2">
          {steps.map((st, idx) => {
            const isSelected = idx === activeStepIdx;
            const isCrash = st.status === "CRASH";
            const isHealed = st.status === "HEALED";

            return (
              <button
                key={idx}
                onClick={() => handleSelectStep(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? isCrash
                      ? "bg-red-950/40 border-red-500 ring-1 ring-red-500 shadow-lg shadow-red-500/20"
                      : isHealed
                      ? "bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500 shadow-lg shadow-emerald-500/20"
                      : "bg-sentinel-card border-sentinel-cyan ring-1 ring-sentinel-cyan shadow-lg shadow-sentinel-cyan/20"
                    : "bg-[#080d18] hover:bg-sentinel-card border-sentinel-border hover:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1 text-[10px] font-mono">
                  <span className={isSelected ? "text-white font-bold" : "text-gray-500"}>
                    {st.timeOffset}
                  </span>
                  {isCrash ? (
                    <Bug className="w-3.5 h-3.5 text-red-400" />
                  ) : isHealed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                  )}
                </div>

                <div className="text-[11px] font-bold text-gray-200 truncate font-sans">
                  {st.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Frame Payload Inspector */}
      <div className="bg-[#080d18] border border-sentinel-border rounded-xl p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Col: Step Details */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                {currentStep.title}
              </span>
              {getStatusBadge(currentStep.status)}
            </div>

            {currentStep.target && (
              <span className="text-[11px] font-mono text-sentinel-cyan bg-sentinel-cyan/10 px-2 py-0.5 rounded border border-sentinel-cyan/30">
                target: {currentStep.target}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            {currentStep.detail}
          </p>

          {/* Code Snippet if applicable */}
          {currentStep.codeSnippet && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                {currentStep.status === "CRASH" ? "Intercepted Exception Call-site:" : "AI Synthesized Production Patch:"}
              </span>
              <pre className={`text-[11px] font-mono p-2.5 rounded-lg border overflow-x-auto ${
                currentStep.status === "CRASH"
                  ? "bg-red-950/20 border-red-800/40 text-red-300"
                  : "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
              }`}>
                {currentStep.codeSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Right Col: Freeze Frame Screenshot / Viewport */}
        <div className="md:col-span-5 bg-black/50 border border-sentinel-border rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-sentinel-cyan" />
              <span>DOM Freeze-Frame</span>
            </span>
            <span className="text-gray-500">1280x800</span>
          </div>

          {currentStep.screenshotUrl ? (
            <div className="rounded-lg overflow-hidden border border-gray-800 h-28 bg-black flex items-center justify-center relative group">
              <img
                src={currentStep.screenshotUrl}
                alt="Frame Screenshot"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-red-950/40 flex items-center justify-center text-red-300 text-[11px] font-mono font-bold">
                💥 Exception Freeze Captured
              </div>
            </div>
          ) : (
            <div className="h-28 rounded-lg bg-black/40 border border-dashed border-gray-800 flex items-center justify-center text-gray-500 font-mono text-xs">
              Interaction normal (No crash)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
