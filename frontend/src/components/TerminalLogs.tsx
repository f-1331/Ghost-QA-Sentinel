// frontend/src/components/TerminalLogs.tsx
// High-Tech Cyberpunk Terminal with Deep QA Inspection, Filter Pills, Manual QA Advisor & Copy
"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { 
  Terminal, 
  Trash2, 
  Copy, 
  Check, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  UserCheck, 
  Search, 
  Maximize2,
  Filter
} from "lucide-react";
import { Language, translations } from "./i18n";
import { soundFX } from "./SoundEffects";

export interface LogMessage {
  level: string; // "INFO" | "WARN" | "ERROR" | "SUCCESS" | "HEAL" | "PASS" | "FAIL" | "MANUAL"
  message: string;
  timestamp: string;
}

interface TerminalProps {
  logs: LogMessage[];
  isScanning: boolean;
  onClear: () => void;
  lang?: Language;
}

type FilterCategory = "ALL" | "PASS" | "FAIL" | "MANUAL" | "HEAL";

export const TerminalLogs: React.FC<TerminalProps> = ({ logs, isScanning, onClear, lang = "uz" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = translations[lang] || translations.uz;
  
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, activeFilter]);

  // Real-time statistics counters
  const stats = useMemo(() => {
    let passCount = 0;
    let failCount = 0;
    let manualCount = 0;
    let healCount = 0;

    logs.forEach((log) => {
      const lvl = log.level.toUpperCase();
      const msg = log.message.toUpperCase();
      if (lvl === "PASS" || msg.includes("[PASS]") || lvl === "SUCCESS") passCount++;
      if (lvl === "FAIL" || lvl === "ERROR" || msg.includes("[FAIL]")) failCount++;
      if (lvl === "MANUAL" || msg.includes("MANUAL QA") || msg.includes("ODAM TEKSHIRISHI")) manualCount++;
      if (lvl === "HEAL" || msg.includes("[AI HEALER]") || msg.includes("[PATCH READY]")) healCount++;
    });

    return { passCount, failCount, manualCount, healCount };
  }, [logs]);

  // Filtered log items
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const lvl = log.level.toUpperCase();
      const msg = log.message.toUpperCase();

      // Category filter
      if (activeFilter === "PASS") {
        if (lvl !== "PASS" && !msg.includes("[PASS]") && lvl !== "SUCCESS") return false;
      } else if (activeFilter === "FAIL") {
        if (lvl !== "FAIL" && lvl !== "ERROR" && !msg.includes("[FAIL]") && lvl !== "WARN") return false;
      } else if (activeFilter === "MANUAL") {
        if (lvl !== "MANUAL" && !msg.includes("MANUAL QA") && !msg.includes("ODAM TEKSHIRISHI")) return false;
      } else if (activeFilter === "HEAL") {
        if (lvl !== "HEAL" && !msg.includes("[AI HEALER]") && !msg.includes("[PATCH READY]")) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!log.message.toLowerCase().includes(q) && !log.level.toLowerCase().includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [logs, activeFilter, searchQuery]);

  const handleCopyLogs = () => {
    soundFX.playClick();
    const formatted = logs.map((l) => `[${l.timestamp}] [${l.level}] ${l.message}`).join("\n");
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelBadge = (level: string, message: string) => {
    const lvl = level.toUpperCase();
    const msg = message.toUpperCase();

    if (lvl === "PASS" || msg.includes("[PASS]") || lvl === "SUCCESS") {
      return (
        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded border font-bold select-none text-emerald-400 bg-emerald-950/60 border-emerald-500/50 flex items-center gap-1 shrink-0">
          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
          <span>PASS</span>
        </span>
      );
    }

    if (lvl === "FAIL" || lvl === "ERROR" || msg.includes("[FAIL]")) {
      return (
        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded border font-bold select-none text-rose-300 bg-rose-950/70 border-rose-500/60 flex items-center gap-1 shrink-0">
          <XCircle className="w-2.5 h-2.5 text-rose-400" />
          <span>FAIL</span>
        </span>
      );
    }

    if (lvl === "MANUAL" || msg.includes("MANUAL QA") || msg.includes("ODAM TEKSHIRISHI")) {
      return (
        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded border font-bold select-none text-purple-300 bg-purple-950/60 border-purple-500/50 flex items-center gap-1 shrink-0">
          <UserCheck className="w-2.5 h-2.5 text-purple-400" />
          <span>MANUAL QA</span>
        </span>
      );
    }

    if (lvl === "HEAL" || msg.includes("[AI HEALER]") || msg.includes("[PATCH READY]")) {
      return (
        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded border font-bold select-none text-cyan-300 bg-cyan-950/60 border-cyan-500/50 flex items-center gap-1 shrink-0">
          <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
          <span>AI HEAL</span>
        </span>
      );
    }

    if (lvl === "WARN") {
      return (
        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded border font-bold select-none text-amber-400 bg-amber-950/50 border-amber-600/50 flex items-center gap-1 shrink-0">
          <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
          <span>WARN</span>
        </span>
      );
    }

    return (
      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded border font-bold select-none text-blue-400 bg-blue-950/40 border-blue-800/40 shrink-0">
        INFO
      </span>
    );
  };

  const getRowHighlight = (level: string, message: string) => {
    const lvl = level.toUpperCase();
    const msg = message.toUpperCase();
    if (lvl === "FAIL" || lvl === "ERROR" || msg.includes("[FAIL]")) return "bg-rose-950/25 border-l-2 border-rose-500 pl-2";
    if (lvl === "PASS" || msg.includes("[PASS]")) return "bg-emerald-950/15 border-l-2 border-emerald-500 pl-2";
    if (lvl === "MANUAL" || msg.includes("MANUAL QA")) return "bg-purple-950/20 border-l-2 border-purple-500 pl-2";
    if (lvl === "HEAL") return "bg-cyan-950/20 border-l-2 border-cyan-500 pl-2";
    return "hover:bg-white/[0.02]";
  };

  return (
    <div 
      className={`bg-[#050811] border border-sentinel-border rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
        isExpanded ? "fixed inset-3 sm:inset-6 z-[1200] h-auto" : "h-[420px] sm:h-[450px]"
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="bg-[#090e1b] px-3 sm:px-4 py-2 sm:py-2.5 border-b border-sentinel-border flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {/* Traffic lights */}
          <div className="hidden sm:flex items-center gap-1.5 mr-1 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block"></span>
          </div>

          <Terminal className="w-4 h-4 text-sentinel-cyan shrink-0" />
          <span className="text-xs font-mono font-bold tracking-wider text-gray-200 truncate">
            {t.terminalTitle}
          </span>

          {isScanning && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-sentinel-amber bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-sentinel-amber animate-ping"></span>
              <span>{t.terminalLiveFeed}</span>
            </span>
          )}
        </div>

        {/* Right Action Tools: Search, Copy, Clear, Expand */}
        <div className="flex items-center gap-1.5 ml-auto text-xs font-mono">
          {/* Real-time search filter */}
          <div className="relative hidden md:block">
            <Search className="w-3 h-3 text-gray-500 absolute left-2 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qidirish / Search logs..."
              className="w-36 lg:w-44 bg-black/60 border border-sentinel-border rounded-lg pl-7 pr-2 py-1 text-[11px] text-gray-200 placeholder-gray-600 focus:outline-none focus:border-sentinel-cyan"
            />
          </div>

          {/* Copy Logs */}
          <button
            onClick={handleCopyLogs}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sentinel-card hover:bg-sentinel-border border border-sentinel-border text-gray-300 hover:text-white transition-all text-[11px]"
            title="Barcha loglarni nusxalash"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-sentinel-cyan" />}
            <span className="hidden sm:inline">{copied ? "Nusxalandi!" : "Nusxalash"}</span>
          </button>

          {/* Clear Logs */}
          <button
            onClick={() => {
              soundFX.playClick();
              onClear();
            }}
            className="text-gray-400 hover:text-gray-200 p-1.5 sm:px-2 sm:py-1 rounded-lg hover:bg-sentinel-card border border-transparent hover:border-sentinel-border transition-colors flex items-center gap-1"
            title="Terminalni tozalash"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.terminalClear}</span>
          </button>

          {/* Maximize / Minimize toggle */}
          <button
            onClick={() => {
              soundFX.playClick();
              setIsExpanded(!isExpanded);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-sentinel-card border border-transparent hover:border-sentinel-border transition-colors"
            title={isExpanded ? "Kichraytirish" : "To'liq ekranga yoyish"}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills Bar (All, Pass, Fail, Manual QA, Heal) */}
      <div className="bg-[#070b16] border-b border-sentinel-border px-3 sm:px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-[11px] font-mono">
        <span className="text-gray-500 mr-1 hidden sm:flex items-center gap-1">
          <Filter className="w-3 h-3" />
          <span>Filtr:</span>
        </span>

        {/* All Filter */}
        <button
          onClick={() => {
            soundFX.playClick();
            setActiveFilter("ALL");
          }}
          className={`px-2.5 py-0.5 rounded-md font-bold transition-all border ${
            activeFilter === "ALL"
              ? "bg-sentinel-cyan text-black border-sentinel-cyan"
              : "bg-sentinel-card/60 text-gray-400 border-transparent hover:text-gray-200"
          }`}
        >
          Barchasi ({logs.length})
        </button>

        {/* PASS Filter */}
        <button
          onClick={() => {
            soundFX.playClick();
            setActiveFilter("PASS");
          }}
          className={`px-2.5 py-0.5 rounded-md font-bold transition-all border flex items-center gap-1 ${
            activeFilter === "PASS"
              ? "bg-emerald-500 text-black border-emerald-500"
              : "bg-emerald-950/30 text-emerald-400 border-emerald-800/40 hover:bg-emerald-950/50"
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>✅ To'g'ri / PASS ({stats.passCount})</span>
        </button>

        {/* FAIL Filter */}
        <button
          onClick={() => {
            soundFX.playClick();
            setActiveFilter("FAIL");
          }}
          className={`px-2.5 py-0.5 rounded-md font-bold transition-all border flex items-center gap-1 ${
            activeFilter === "FAIL"
              ? "bg-rose-500 text-white border-rose-500"
              : "bg-rose-950/30 text-rose-400 border-rose-800/40 hover:bg-rose-950/50"
          }`}
        >
          <XCircle className="w-3 h-3" />
          <span>❌ Xatolar / FAIL ({stats.failCount})</span>
        </button>

        {/* MANUAL QA Filter */}
        <button
          onClick={() => {
            soundFX.playClick();
            setActiveFilter("MANUAL");
          }}
          className={`px-2.5 py-0.5 rounded-md font-bold transition-all border flex items-center gap-1 ${
            activeFilter === "MANUAL"
              ? "bg-purple-500 text-white border-purple-500"
              : "bg-purple-950/30 text-purple-300 border-purple-800/40 hover:bg-purple-950/50"
          }`}
        >
          <UserCheck className="w-3 h-3" />
          <span>👤 Insoniy QA Tavsiya ({stats.manualCount})</span>
        </button>

        {/* HEAL Filter */}
        <button
          onClick={() => {
            soundFX.playClick();
            setActiveFilter("HEAL");
          }}
          className={`px-2.5 py-0.5 rounded-md font-bold transition-all border flex items-center gap-1 ${
            activeFilter === "HEAL"
              ? "bg-cyan-500 text-black border-cyan-500"
              : "bg-cyan-950/30 text-cyan-300 border-cyan-800/40 hover:bg-cyan-950/50"
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>⚡ AI Patchlar ({stats.healCount})</span>
        </button>
      </div>

      {/* Terminal Log Output List */}
      <div
        ref={scrollRef}
        className="flex-1 p-3 sm:p-4 overflow-y-auto font-mono text-[11px] sm:text-[12px] leading-relaxed space-y-1.5 bg-[#030610]"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-gray-600 italic py-12 text-center flex flex-col items-center justify-center gap-2">
            <Terminal className="w-8 h-8 opacity-40 text-sentinel-cyan" />
            <span>
              {logs.length === 0 
                ? t.terminalWaiting 
                : "Ushbu filtr bo'yicha hech qanday log xabari topilmadi."}
            </span>
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-2.5 px-2 py-1 rounded transition-colors ${getRowHighlight(log.level, log.message)}`}
            >
              <span className="text-gray-500 text-[10px] select-none pt-0.5 whitespace-nowrap shrink-0">
                {log.timestamp}
              </span>
              
              {getLevelBadge(log.level, log.message)}

              <span className="text-gray-300 break-words flex-1 leading-snug">
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Terminal Live Telemetry Footer Bar */}
      <div className="bg-[#090e1a] border-t border-sentinel-border px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] font-mono text-gray-400 shrink-0 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>{stats.passCount} PASS</span>
          </span>

          <span className="flex items-center gap-1 text-rose-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
            <span>{stats.failCount} FAIL</span>
          </span>

          <span className="flex items-center gap-1 text-purple-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
            <span>{stats.manualCount} MANUAL REVIEW</span>
          </span>

          <span className="flex items-center gap-1 text-cyan-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span>
            <span>{stats.healCount} AI HEALED</span>
          </span>
        </div>

        <div className="text-gray-500 flex items-center gap-2 ml-auto">
          <span>Dual-Viewport: 1280x800 & 390x844</span>
          <span>•</span>
          <span className="text-sentinel-cyan">Playwright Chromium</span>
        </div>
      </div>
    </div>
  );
};
