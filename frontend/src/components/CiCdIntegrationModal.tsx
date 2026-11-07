// frontend/src/components/CiCdIntegrationModal.tsx
"use client";

import React, { useState } from "react";
import { 
  X, 
  GitBranch, 
  Terminal, 
  Copy, 
  Check, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Send,
  Workflow
} from "lucide-react";
import { Language, translations } from "./i18n";
import { soundFX } from "./SoundEffects";

interface CiCdIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const CiCdIntegrationModal: React.FC<CiCdIntegrationModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<"github" | "gitlab" | "docker" | "webhook">("github");
  const [copied, setCopied] = useState(false);
  const t = translations[lang] || translations.uz;

  if (!isOpen) return null;

  const githubActionYaml = `name: Ghost-QA Autonomous Sentinel CI/CD Guard

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  sentinel-chaos-audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Setup Python 3.11
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install Playwright & Dependencies
        run: |
          pip install playwright pytest google-genai
          playwright install --with-deps chromium

      - name: Run Ghost-QA Chaos Crawler
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
          TELEGRAM_BOT_TOKEN: \${{ secrets.TELEGRAM_BOT_TOKEN }}
        run: |
          python -m backend.cli --url "https://staging.yourdomain.com" --auto-heal
`;

  const dockerComposeYaml = `version: '3.8'

services:
  ghost-sentinel-core:
    image: ghcr.io/f-1331/ghost-qa-sentinel:latest
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - TELEGRAM_BOT_TOKEN=\${TELEGRAM_BOT_TOKEN}
      - TARGET_URL=http://web-app:3000
    restart: unless-stopped
`;

  const webhookJson = `{
  "event": "incident.discovered",
  "incident_id": "inc-checkout-001",
  "severity": "CRITICAL",
  "bug_type": "PAGE_ERROR",
  "target_file": "demo-broken-app/app.js",
  "ai_solution_ready": true,
  "diff_url": "https://ghost-qa-sentinel.vercel.app#inc-checkout-001"
}`;

  const getActiveSnippet = () => {
    switch (activeTab) {
      case "github": return githubActionYaml;
      case "docker": return dockerComposeYaml;
      case "webhook": return webhookJson;
      default: return githubActionYaml;
    }
  };

  const handleCopy = () => {
    soundFX.playClick();
    navigator.clipboard.writeText(getActiveSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-sentinel-surface border border-sentinel-border rounded-2xl max-w-2xl w-full shadow-2xl shadow-sentinel-cyan/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-sentinel-border bg-sentinel-card/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sentinel-cyan/15 border border-sentinel-cyan/30 flex items-center justify-center">
              <Workflow className="w-5 h-5 text-sentinel-cyan" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-sentinel-cyan block">
                CI/CD PIPELINE CENTER
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {t.cicdModalTitle}
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

        {/* Tab Switcher */}
        <div className="px-6 pt-4 flex items-center gap-2 border-b border-sentinel-border bg-[#0a0f1d] text-xs font-mono">
          <button
            onClick={() => setActiveTab("github")}
            className={`pb-3 px-3 border-b-2 font-bold transition-all ${
              activeTab === "github"
                ? "border-sentinel-cyan text-sentinel-cyan"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            GitHub Actions (.yml)
          </button>

          <button
            onClick={() => setActiveTab("docker")}
            className={`pb-3 px-3 border-b-2 font-bold transition-all ${
              activeTab === "docker"
                ? "border-sentinel-cyan text-sentinel-cyan"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Docker Compose
          </button>

          <button
            onClick={() => setActiveTab("webhook")}
            className={`pb-3 px-3 border-b-2 font-bold transition-all ${
              activeTab === "webhook"
                ? "border-sentinel-cyan text-sentinel-cyan"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Webhook Payload
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 font-mono text-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span>
              {activeTab === "github" ? ".github/workflows/ghost-qa-sentinel.yml" : activeTab === "docker" ? "docker-compose.yml" : "POST /webhook"}
            </span>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sentinel-card hover:bg-sentinel-border border border-sentinel-border text-gray-200 transition-all font-sans"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">{t.copiedSuccess}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-sentinel-cyan" />
                  <span>{t.copyBtn}</span>
                </>
              )}
            </button>
          </div>

          <pre className="bg-[#050811] border border-sentinel-border rounded-xl p-4 overflow-x-auto text-gray-300 text-[11px] leading-relaxed">
            {getActiveSnippet()}
          </pre>

          <div className="bg-sentinel-card border border-sentinel-border rounded-xl p-3.5 text-gray-300 font-sans text-xs space-y-1">
            <span className="text-sentinel-cyan font-bold font-mono text-[11px]">{t.cicdZeroConfigTitle}</span>
            <p>
              {t.cicdZeroConfigDesc}
            </p>
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
