"use client";

import React from "react";
import { Shield, Radio, Terminal, Bot, Github, ExternalLink, Zap } from "lucide-react";

interface NavbarProps {
  systemHealth: {
    browser_engine?: string;
    gemini_active?: boolean;
    github_active?: boolean;
    telegram_active?: boolean;
    simulation_mode?: boolean;
  } | null;
}

export const Navbar: React.FC<NavbarProps> = ({ systemHealth }) => {
  return (
    <header className="border-b border-sentinel-border bg-sentinel-surface/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5">
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

        {/* Subsystem Telemetry Indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          {/* Playwright Headless Engine */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sentinel-card border border-sentinel-border shadow-sm">
            <Radio className="w-3.5 h-3.5 text-sentinel-emerald animate-pulse" />
            <span className="text-gray-300">Playwright Chromium</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">READY</span>
          </div>

          {/* Gemini AI Core */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sentinel-card border border-sentinel-border shadow-sm">
            <Bot className="w-3.5 h-3.5 text-sentinel-cyan" />
            <span className="text-gray-300">Gemini 2.5 Flash</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-bold">
              {systemHealth?.gemini_active ? "ACTIVE" : "AUTO-HEAL"}
            </span>
          </div>

          {/* GitHub Engine */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sentinel-card border border-sentinel-border shadow-sm">
            <Github className="w-3.5 h-3.5 text-sentinel-purple" />
            <span className="text-gray-300">GitHub Sync</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 font-bold">
              {systemHealth?.github_active ? "LIVE" : "SIMULATED"}
            </span>
          </div>

          {/* Demo Sandbox Quick Link */}
          <a
            href="http://localhost:8000/sandbox"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:bg-blue-600/30 transition-colors font-sans font-medium"
          >
            <span>Live Sandbox Target</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
};
