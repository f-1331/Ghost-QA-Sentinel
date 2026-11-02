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
  Gamepad2
} from "lucide-react";
import { soundFX } from "./SoundEffects";

interface NavbarProps {
  systemHealth: {
    browser_engine?: string;
    gemini_active?: boolean;
    github_active?: boolean;
    telegram_active?: boolean;
    simulation_mode?: boolean;
  } | null;
  onOpenSandboxModal: () => void;
  onExportReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  systemHealth,
  onOpenSandboxModal,
  onExportReport,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundFX.enabled = newState;
    if (newState) {
      soundFX.playHealedChime();
    }
  };

  return (
    <header className="border-b border-sentinel-border bg-sentinel-surface/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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
              AUTONOMOUS CHAOS CRAWLER & AI SELF-HEALER
            </p>
          </div>
        </div>

        {/* Subsystem Telemetry & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          {/* Telegram Bot Direct Pill */}
          <a
            href="https://t.me/ghost_qa_sentinel_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0088cc]/20 border border-[#0088cc]/50 text-[#38bdf8] hover:bg-[#0088cc]/30 transition-all font-sans font-medium"
            title="Open Telegram Sentinel Bot"
          >
            <Send className="w-3.5 h-3.5" />
            <span>@ghost_qa_sentinel_bot</span>
          </a>

          {/* Interactive Sandbox Testbench Modal Trigger */}
          <button
            onClick={onOpenSandboxModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 transition-all font-sans font-medium"
            title="Open Interactive Sandbox Target Testbench"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Sandbox Testbench</span>
          </button>

          {/* Export Audit Report */}
          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sentinel-card hover:bg-sentinel-border border border-sentinel-border text-gray-200 hover:text-white transition-all font-sans"
            title="Download Full Markdown Audit Report"
          >
            <FileDown className="w-3.5 h-3.5 text-sentinel-cyan" />
            <span>Export Report</span>
          </button>

          {/* Audio FX Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled
                ? "bg-sentinel-card border-sentinel-cyan/40 text-sentinel-cyan"
                : "bg-sentinel-card border-gray-800 text-gray-500"
            }`}
            title={soundEnabled ? "Mute Cyberpunk Audio FX" : "Unmute Audio FX"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
