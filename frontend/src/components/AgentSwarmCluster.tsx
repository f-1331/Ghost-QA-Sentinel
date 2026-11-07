// frontend/src/components/AgentSwarmCluster.tsx
// 5-Agent Autonomous Multi-Agent Swarm Cluster (Red-Team, Crawler, Healer, Mobile, Reporter)
"use client";

import React, { useState, useEffect } from "react";
import { 
  Bot, 
  Cpu, 
  Flame, 
  ShieldAlert, 
  Smartphone, 
  Sparkles, 
  Radio, 
  Send, 
  Zap, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  Gauge
} from "lucide-react";
import { Language, translations } from "./i18n";
import { soundFX } from "./SoundEffects";
import { cyberVoice } from "./VoiceSynthesizer";

interface AgentSwarmClusterProps {
  isScanning: boolean;
  lang: Language;
  targetUrl: string;
  onTriggerFullSwarm?: () => void;
}

interface SwarmAgent {
  id: string;
  name: string;
  role: string;
  status: "IDLE" | "ACTIVE" | "ATTACKING" | "HEALING" | "OPTIMIZED";
  pulseColor: string;
  borderColor: string;
  bgColor: string;
  icon: any;
  metricLabel: string;
  metricValue: string;
  specialty: string;
  activeLog: string;
}

export const AgentSwarmCluster: React.FC<AgentSwarmClusterProps> = ({
  isScanning,
  lang,
  targetUrl,
  onTriggerFullSwarm
}) => {
  const [overdriveActive, setOverdriveActive] = useState(false);
  const [swarmTick, setSwarmTick] = useState(0);

  // Dynamic status ticks during active scanning
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setSwarmTick((prev) => (prev + 1) % 100);
    }, 1200);
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleToggleOverdrive = () => {
    soundFX.playClick();
    setOverdriveActive(!overdriveActive);
    if (!overdriveActive) {
      soundFX.playBugDetectedAlert();
      cyberVoice.speak(
        lang === "uz" 
          ? "Agent Swarm Overdrive rejimi faollashtirildi! Beshta agent to'liq quvvatda ishlamoqda." 
          : "Agent Swarm Overdrive activated! All five autonomous agents engaged at maximum throttle.",
        lang
      );
    }
    if (onTriggerFullSwarm) {
      onTriggerFullSwarm();
    }
  };

  const agents: SwarmAgent[] = [
    {
      id: "agent-crawler",
      name: "Crawler Agent 01",
      role: lang === "uz" ? "DOM & Route Navigator" : "DOM & Route Navigator",
      status: isScanning ? "ACTIVE" : "OPTIMIZED",
      pulseColor: "bg-cyan-400",
      borderColor: "border-cyan-500/40",
      bgColor: "bg-cyan-950/20",
      icon: Radio,
      metricLabel: lang === "uz" ? "Tekshirilgan DOM" : "DOM Nodes",
      metricValue: isScanning ? `${120 + (swarmTick % 30)} Element` : "142 Element",
      specialty: "Playwright Chromium headless browser & routing interceptor",
      activeLog: isScanning 
        ? "Desktop 1280x800 oynasida DOM daraxti titkilanmoqda..." 
        : "Desktop DOM daraxti va asinxron bundlelar toza holatda"
    },
    {
      id: "agent-redteam",
      name: "Red-Team Agent 02",
      role: lang === "uz" ? "Chaos & Exploit Fuzzer" : "Chaos & Exploit Fuzzer",
      status: isScanning || overdriveActive ? "ATTACKING" : "IDLE",
      pulseColor: "bg-rose-500",
      borderColor: "border-rose-500/40",
      bgColor: "bg-rose-950/20",
      icon: Flame,
      metricLabel: lang === "uz" ? "Hujum Vektorlari" : "Attack Vectors",
      metricValue: overdriveActive ? "8/8 Aktiv" : isScanning ? "6/8 Fuzzed" : "8 Tayyor",
      specialty: "SQLi, XSS, Z-Index collision, Concurrency flood",
      activeLog: isScanning 
        ? "XSS va Z-Index modallar ustidan to'qnashuvlar sinovdan o'tmoqda..." 
        : "8 ta kiberhujum ssenariysi keshda tayyor holatda"
    },
    {
      id: "agent-mobile",
      name: "Mobile & Typo Agent 03",
      role: lang === "uz" ? "390x844 Ergonomics Auditor" : "390x844 Ergonomics Auditor",
      status: isScanning ? "ACTIVE" : "OPTIMIZED",
      pulseColor: "bg-amber-400",
      borderColor: "border-amber-500/40",
      bgColor: "bg-amber-950/20",
      icon: Smartphone,
      metricLabel: lang === "uz" ? "Mobil Tekshiruv" : "Mobile Viewport",
      metricValue: isScanning ? "418px > 390px" : "390x844 OK",
      specialty: "Gorizontal surilish (overflow-x), harflar kolliziyasi, 44px tap targets",
      activeLog: isScanning 
        ? "Mobil ekranda harflar bir-biriga minib qolishi o'lchanmoqda..." 
        : "WCAG touch-target va harflar satr balandligi me'yorlandi"
    },
    {
      id: "agent-gemini",
      name: "Gemini 3.8 Healer 04",
      role: lang === "uz" ? "AST Autonomous Code Surgeon" : "AST Autonomous Code Surgeon",
      status: isScanning ? "HEALING" : "OPTIMIZED",
      pulseColor: "bg-purple-400",
      borderColor: "border-purple-500/40",
      bgColor: "bg-purple-950/20",
      icon: Sparkles,
      metricLabel: lang === "uz" ? "AI Aniqligi" : "AI Confidence",
      metricValue: "99.8% AST",
      specialty: "Unified Git Diff generatsiyasi, zero-regression patchlar",
      activeLog: isScanning 
        ? "4 ta nuqson uchun toza TypeScript & CSS git diff tuzilmoqda..." 
        : "4 ta avtonom patch yaratilgan va GitHub PR ga tayyor"
    },
    {
      id: "agent-reporter",
      name: "Reporter Agent 05",
      role: lang === "uz" ? "Telemetry & Intel Dispatcher" : "Telemetry & Intel Dispatcher",
      status: isScanning ? "ACTIVE" : "OPTIMIZED",
      pulseColor: "bg-emerald-400",
      borderColor: "border-emerald-500/40",
      bgColor: "bg-emerald-950/20",
      icon: Send,
      metricLabel: lang === "uz" ? "Hisobot Shlyuzi" : "Broadcast Gateway",
      metricValue: "Neon + Telegram",
      specialty: "Neon PostgreSQL, Telegram Sentinel Bot, PDF Whitepaper",
      activeLog: isScanning 
        ? "Real vaqtda telemetriya Neon DB va Telegram botga uzatilmoqda..." 
        : "Barcha hisobotlar va telemetriya sinxronlashtirildi"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-[#070b14] via-sentinel-surface to-[#0a1120] border border-sentinel-border rounded-2xl p-5 shadow-2xl relative overflow-hidden">
      {/* Background Cyber Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-sentinel-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-48 bg-sentinel-purple/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-sentinel-border/70 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sentinel-cyan/20 to-sentinel-purple/20 border border-sentinel-cyan/40 flex items-center justify-center text-sentinel-cyan shadow-lg shadow-sentinel-cyan/20">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-bold text-white tracking-wide uppercase font-mono">
                {lang === "uz" ? "5-Agentli Avtonom Red-Team & Healer Klasteri" : "5-Agent Autonomous Swarm Cluster"}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 font-mono font-bold animate-pulse">
                SWARM ACTIVE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans mt-0.5">
              {lang === "uz"
                ? "Bir vaqtning o'zida parallel ishlovchi 5 ta ixtisoslashgan AI agenti web ilovangizni chegarasiz tahlil qiladi."
                : "5 parallel specialized AI agents conducting deep multi-vector penetration testing & auto-repair."}
            </p>
          </div>
        </div>

        {/* Overdrive Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleOverdrive}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-lg ${
              overdriveActive
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 border border-rose-400 animate-pulse"
                : "bg-sentinel-card hover:bg-sentinel-border text-cyan-300 border border-sentinel-cyan/40 hover:shadow-sentinel-cyan/20"
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${overdriveActive ? "fill-white animate-spin" : "text-cyan-400"}`} />
            <span>
              {overdriveActive 
                ? (lang === "uz" ? "OVERDRIVE: MAKSIMAL BO'RON (FAOL)" : "OVERDRIVE: FULL ASSAULT")
                : (lang === "uz" ? "⚡ Swarm Overdrive (Maksimal Quvvat)" : "⚡ Swarm Overdrive")}
            </span>
          </button>
        </div>
      </div>

      {/* 5-Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-4 relative z-10">
        {agents.map((agent) => {
          const IconComponent = agent.icon;
          return (
            <div
              key={agent.id}
              className={`rounded-xl border ${agent.borderColor} ${agent.bgColor} p-3.5 flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-lg relative overflow-hidden`}
            >
              {/* Agent Active Ambient Corner */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-white">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white font-mono leading-none">
                      {agent.name}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-sans block mt-0.5">
                      {agent.role}
                    </span>
                  </div>
                </div>

                {/* Pulse Indicator */}
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${agent.pulseColor} ${isScanning || overdriveActive ? "animate-ping" : ""}`} />
                  <span className="text-[9px] font-mono text-gray-400 font-semibold">
                    {agent.status}
                  </span>
                </div>
              </div>

              {/* Metric Box */}
              <div className="my-2 p-2 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-400">
                  {agent.metricLabel}:
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  {agent.metricValue}
                </span>
              </div>

              {/* Dynamic Live Action Log */}
              <div className="text-[10px] font-mono text-gray-300 leading-relaxed bg-black/30 p-2 rounded border border-white/5 line-clamp-2">
                <span className="text-sentinel-cyan mr-1">▶</span>
                {agent.activeLog}
              </div>

              {/* Specialty Footer */}
              <div className="mt-2 pt-2 border-t border-white/5 text-[9px] text-gray-400 font-sans truncate" title={agent.specialty}>
                {agent.specialty}
              </div>
            </div>
          );
        })}
      </div>

      {/* Swarm Live Telemetry Bar */}
      <div className="mt-4 pt-3 border-t border-sentinel-border/50 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-400 relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-sentinel-cyan" />
            <span>Swarm Latency: <strong className="text-white">12ms</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target: <strong className="text-white font-mono truncate max-w-[200px]">{targetUrl}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">
            {lang === "uz" ? "Barcha 5 ta Agent aloqada va tayyor" : "All 5 Agents Online & Synced"}
          </span>
        </div>
      </div>
    </section>
  );
};
