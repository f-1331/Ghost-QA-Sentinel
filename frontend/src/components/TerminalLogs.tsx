// frontend/src/components/TerminalLogs.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { Terminal, Trash2, ShieldAlert } from "lucide-react";
import { Language, translations } from "./i18n";

export interface LogMessage {
  level: string;
  message: string;
  timestamp: string;
}

interface TerminalProps {
  logs: LogMessage[];
  isScanning: boolean;
  onClear: () => void;
  lang?: Language;
}

export const TerminalLogs: React.FC<TerminalProps> = ({ logs, isScanning, onClear, lang = "uz" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = translations[lang] || translations.uz;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelStyle = (level: string) => {
    switch (level.toUpperCase()) {
      case "ERROR":
        return "text-red-400 bg-red-950/40 border-red-800/40";
      case "WARN":
        return "text-amber-400 bg-amber-950/40 border-amber-800/40";
      case "SUCCESS":
        return "text-emerald-400 bg-emerald-950/40 border-emerald-800/40";
      case "HEAL":
        return "text-cyan-400 bg-cyan-950/40 border-cyan-800/40";
      default:
        return "text-blue-400 bg-blue-950/40 border-blue-800/40";
    }
  };

  return (
    <div className="bg-[#050811] border border-sentinel-border rounded-xl shadow-2xl overflow-hidden flex flex-col h-[340px]">
      {/* Terminal Title Bar */}
      <div className="bg-[#0c1220] px-4 py-2.5 border-b border-sentinel-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block"></span>
          </div>

          <Terminal className="w-4 h-4 text-sentinel-cyan" />
          <span className="text-xs font-mono font-bold tracking-wider text-gray-200">
            {t.terminalTitle}
          </span>
          {isScanning && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-sentinel-amber bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-sentinel-amber animate-ping"></span>
              {t.terminalLiveFeed}
            </span>
          )}
        </div>

        <button
          onClick={onClear}
          className="text-gray-400 hover:text-gray-200 text-xs flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-sentinel-surface font-mono"
          title="Clear console"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.terminalClear}</span>
        </button>
      </div>

      {/* Terminal Log Output */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-[12px] leading-relaxed space-y-1.5"
      >
        {logs.length === 0 ? (
          <div className="text-gray-600 italic py-8 text-center flex flex-col items-center justify-center gap-2">
            <Terminal className="w-8 h-8 opacity-40 text-sentinel-cyan" />
            <span>{t.terminalWaiting}</span>
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2.5 hover:bg-white/[0.02] px-1 py-0.5 rounded">
              <span className="text-gray-500 text-[10px] select-none pt-0.5 whitespace-nowrap">
                {log.timestamp}
              </span>
              <span
                className={`text-[9px] uppercase px-1.5 py-0.2 rounded border font-bold select-none ${getLevelStyle(
                  log.level
                )}`}
              >
                {log.level}
              </span>
              <span className="text-gray-300 break-all">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
